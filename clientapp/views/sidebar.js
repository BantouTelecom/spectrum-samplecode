var BaseView = require('views/base'),
    ich = require('icanhaz');


module.exports = BaseView.extend({
    events: {
        'click .conversationList li .close': 'onConversationItemCloseClick',
        'click .contactList li .call': 'onContactItemVideoCallClick',
        'click .contactList li .startChat': 'onContactItemChatClick',
        'click .contactLIst li .startPhoneCall': 'onContactItemCallClick',
        'click .contactList li': 'onContactItemClick',
        'click .conversationList li': 'onConversationItemClick'
    },
    initialize: function () {
        app.contacts.on('reset add remove change:online', this.render, this);
        app.conversations.on('reset add remove change:online', this.render, this);
        this.bindomatic(app, 'change:selectedItem', this.onSelectedItemChanged, {trigger: true});
    },
    render: function () {
        var self = this;
        this.$el.html(ich.sidebar(app.toJSON()).html());
        this.$conversations = this.$('.conversationList').empty();
        this.$contacts = this.$('.contactList').empty();
        
        /*
        if (this.conversationViews) {
            _.each(this.conversationViews, function (view) {
                view.unbindomatic();
            });
        }
        if (this.contactListViews) {
            _.each(this.contactListViews, function (view) {
                view.unbindomatic();
            });
        }

        this.conversationViews = [];
        this.contactListViews = [];
        */

        app.contacts.each(function (model) {
            self.$contacts.append(ich.contactListItem(model.toTemplate()));
        });

        app.conversations.each(function (model) {
            self.$conversations.append(ich.conversationListItem(model.toTemplate()));
        });

        return this;
    },
    onSelectedItemChanged: function (model, id) {
        this.$('li').each(function () {
            if ($(this).data('id') == id) {
                $(this).addClass('selected');
            } else {
                $(this).removeClass('selected');
            }
        });
    },
    onContactItemClick: function (e) {
        var contact = this.getModelFromEvent(e, 'contact');
        contact.viewModel();
        app.set('drawerOpen', false);
        return false;
    },
    onConversationItemClick: function (e) {
        var convo = this.getModelFromEvent(e, 'conversation');
        app.showConversation(convo);
    },
    onConversationItemCloseClick: function (e) {
        var convo = this.getModelFromEvent(e, 'conversation');
        if (convo) app.conversations.remove(convo);
    },
    onContactItemVideoCallClick: function (e) {
        var contact = this.getModelFromEvent(e, 'contact');
        if (contact) contact.call();
    },
    onContactItemChatClick: function (e) {
        var contact = this.getModelFromEvent(e, 'contact');
        if (contact) contact.startConversation();
    },
    onContactItemCallClick: function (e) {
        var contact = this.getModelFromEvent(e, 'contact');
        if (contact) contact.call();
    },
    // takes the click event and reads the id off the closest containing el
    getModelFromEvent: function (event, type) {
        event.stopImmediatePropagation();
        var el = $(event.target),
            id;
        //Because our ids are namespaced w/ a label_ we need to extract the ids from them, hence the split/pop
        if (el.hasClass(type)) {
            return app[type + 's'].get(el.data('id').split('_').pop());
        } else {
            return app[type + 's'].get(el.closest('.' + type).data('id').split('_').pop());
        }
    }
});
