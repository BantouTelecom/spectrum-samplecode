var Backbone = require('backbone'),
    _ = require('underscore');


module.exports = Backbone.View.extend({
    destroy: function () {
        this.unbindomatic();
        this.trigger('destroy');
        this.remove();
    },
    bindomatic: function (model, ev, handler, options) {
        var boundHandler = _(handler).bind(this),
        evs = (ev instanceof Array) ? ev : [ev];
        _(evs).each(function (ev) {
            model.on(ev, boundHandler);
        });
        if (options && options.trigger) boundHandler();
        (this.unbindomatic_list = this.unbindomatic_list || []).push(function () {
            _(evs).each(function (ev) {
                model.off(ev, boundHandler);
            });
        });
    },
    unbindomatic: function () {
        _(this.unbindomatic_list || []).each(function (unbind) {
            unbind();
        });
    },
    // ###handleBindings
    // This makes it simple to bind model attributes to the view.
    // To use it, add a `classBindings` and/or a `contentBindings` attribute
    // to your view and call `this.handleBindings()` at the end of your view's 
    // `render` function. It's also used by `basicRender` which lets you do 
    // a complete attribute-bound views with just this:
    //
    //         var ProfileView = Capsule.View.extend({
    //             template: 'profile',
    //             contentBindings: {
    //                 'name': '.name'
    //             },
    //             classBindings: {
    //                 'active': '' 
    //             },
    //             render: function () {
    //                 this.basicRender();
    //                 return this;
    //             }
    //         });
    handleBindings: function () {
        var self = this;
        if (this.contentBindings) {
            _.each(this.contentBindings, function (selector, key) {
                self.bindomatic(self.model, 'change:' + key, function () {
                    var el = (selector.length > 0) ? self.$(selector) : $(self.el);
                    el.html(self.model.get(key));
                });
            });
        }
        if (this.inputBindings) {
            _.each(this.inputBindings, function (selector, key) {
                self.bindomatic(self.model, 'change:' + key, function () {
                    var el = (selector.length > 0) ? self.$(selector) : $(self.el);
                    el.val(self.model.get(key));
                });
            });
        }
        if (this.imageBindings) {
            _.each(this.imageBindings, function (selector, key) {
                self.bindomatic(self.model, 'change:' + key, function () {
                    var el = (selector.length > 0) ? self.$(selector) : $(self.el),
                        newValue = self.model.get(key);
                    el.attr('src', newValue);
                    el[newValue ? 'show' : 'hide']();
                });
            });
        }
        if (this.classBindings) {
            _.each(this.classBindings, function (selector, keyString) {
                var key = keyString.split(' ')[0],
                    className = keyString.split(' ')[1] || key;
                self.bindomatic(self.model, 'change:' + key, function () {
                    var newValue = self.model.get(key),
                        prev = self.model.previous(key),
                        el = (selector.length > 0) ? self.$(selector) : $(self.el);
                    if (_.isBoolean(newValue)) {
                        if (newValue) {
                            el.addClass(className);
                        } else {
                            el.removeClass(className);        
                        }
                    } else {
                        if (prev) el.removeClass(prev);
                        el.addClass(newValue);
                    }
                }, {trigger: true});
            });
        }
        return this;
    }
});
