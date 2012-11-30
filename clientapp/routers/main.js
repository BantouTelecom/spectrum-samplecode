var Backbone = require('backbone');


module.exports = Backbone.Router.extend({
    initialize: function () {
        this.on('all', this.handleRouteChange, this);
    },
    routes: {
        '': 'home',
        'files': 'files',
        'messages': 'messages',
        'messages?sms': 'messages',
        'messages/static': 'staticMessages',
        'messages/:id': 'conversation',
        'static': 'static', // this will probably just go into messages
        'video': 'video',
        'apps': 'apps',
        'contacts': 'contacts',
        'contacts/new': 'newContact',
        'contacts/:id': 'viewContact',
        'contacts/:id/edit': 'editContact',
        'location': 'location',
        'oauth-callback/:code': 'oauthCallback'
    },
    home: function () {
        app.navigate('messages');
    },
    files: function () {
        var FilesPage = require('pages/files');
        app.renderPage(new FilesPage({
            model: app,
            collection: app.files
        }));
    },
    apps: function () {
        var AppPage = require('pages/apps');
        this.unsetSelected();
        app.renderPage(new AppPage({
            model: app
        }));
    },
    video: function () {
        var VideoPage = require('pages/video');
        app.renderPage(new VideoPage({
            model: app
        }));
    },
    static: function () {
        var StaticPage = require('pages/static');
        this.unsetSelected();
        app.renderPage(new StaticPage({
            model: app
        }));
    },
    // always redirect to first or new
    contacts: function () {
        var contact = app.contacts.first();
        if (contact) {
            app.navigate('contacts/' + contact.id);
        } else {
            this.unsetSelected();
            app.navigate('contacts/new');
        }
        return;
    },
    newContact: function () {
        var ContactFormPage = require('pages/contactForm');
        this.unsetSelected();
        app.renderPage(new ContactFormPage({
            collection: app.contacts
        }));
    },
    viewContact: function (id) {
        var contact = app.contacts.get(id),
            ContactDetailPage = require('pages/contactDetail');
        if (!contact) {
            app.navigate('');
            return;
        }
        app.set('selectedItem', 'contact_' + id);
        app.renderPage(new ContactDetailPage({
            model: contact,
            collection: app.contacts
        }));
    },
    editContact: function (id) {
        var contact = app.contacts.get(id),
            ContactEditPage = require('pages/contactEdit');
        if (!contact) {
            app.navigate('');
            return;
        }

        app.set('selectedItem', id);
        app.renderPage(new ContactEditPage({
            model: contact,
            collection: app.contacts
        }));
    },
    messages: function () {
        var MessagesPage = require('pages/messages');
        
        this.unsetSelected();
        app.renderPage(new MessagesPage({
            empty: true
        }));
    },
    conversation: function (id) {
        var MessagesPage = require('pages/messages'),
            conversation = app.conversations.get(id);

        app.set('selectedItem', 'conversation_' + id);
        if (!conversation) {
            app.navigate('messages');
        } else {
            app.renderPage(new MessagesPage({
                collection: conversation.messages,
                model: conversation
            }));
        }
    },
    staticMessages: function () {
        var MessagesPage = require('pages/staticMessages');
        
        this.unsetSelected();
        app.renderPage(new MessagesPage({
            model: app
        }));
    },
    location: function () {
        var LocationPage = require('pages/location');

        this.unsetSelected();
        app.renderPage(new LocationPage({
            model: app
        }));
    },
    unsetSelected: function () {
        app.set('selectedItem', '');
    }
});
