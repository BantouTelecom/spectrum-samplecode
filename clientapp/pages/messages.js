var PageView = require('pages/base'),
    ConversationView = require('views/conversation'),
    ich = require('icanhaz');


module.exports = PageView.extend({
    initialize: function (stuff) {
        // indicator if we have any messages or not
        this.empty = stuff.empty;
        this.on('hide', this.onHide, this);
    },
    render: function () {
        var view; 
        this.setElement(ich.messagesPage(this.model && this.model.toTemplate()));
        view = new ConversationView({model: this.model}); 
        this.$('.mainContent').html(view.render().el);
        
        // add remove 'empty' class for these styles
        this.$el[(this.empty) ? 'addClass' : 'removeClass']('empty');
        return this;
    },
    onHide: function () {
        app.set('videoVisible', false);
    }
});