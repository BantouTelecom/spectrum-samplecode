var BaseModel = require('models/baseModel'),
    Messages = require('models/messages');


module.exports = BaseModel.extend({
    templateHelpers: ['contact'],
    initialize: function () {
        this.messages = new Messages();
    },
    getRelatedContact: function () {
        return app.contacts.get(this.get('id'));
    },
    contact: function () {
        var contact = this.getRelatedContact();
        if (contact) {
            return contact.toTemplate();
        } else {
            return {};
        }
    }
});