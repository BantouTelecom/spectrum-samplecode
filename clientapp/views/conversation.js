var BaseView = require('views/base'),
    ich = require('icanhaz'),
    _ = require('underscore');


module.exports = BaseView.extend({
    events: {
        'keydown .chatInput': 'handleKeyUp',
        'click .chatSend': 'handleChatSendClick',
        'click .smsSend': 'handleSMSSendClick'
    },
    inputBindings: {
        'number': '.numberToCall'
    },
    initialize: function (stuff) {
        if (stuff.model) {
            this.bindomatic(this.model.messages, 'add', this.handleMessageAdd);
            var contact = this.contact = this.model.getRelatedContact && this.model.getRelatedContact();
            if (contact) {
                this.bindomatic(contact, 'change:online', this.handleChangeOnline);
            }
        }
    },
    render: function () {
        var context = {};
        if (this.model) {
            context = this.model.toTemplate();
            _.extend(context, {
                messages: this.model.messages.map(function (message) {
                    return message.toTemplate();
                })
            });
        }
        this.setElement(ich.conversation(context));
        this.$input = this.$('.chatInput');
        this.$discussion = this.$('.discussion');

        if (this.model) {
            // trigger this each time
            this.handleChangeOnline();
        }

        return this;
    },
    handleMessageAdd: function (model, collection) {
        var height;
        this.$discussion.append(ich.chatMessage(model.toTemplate()));
        height = this.$discussion.height();
        if (height > ($(window).height() - 130)) {
            $('body').animate({scrollTop: height + 130});
        }
    },
    handleKeyUp: function (e) {
        if (e.which === 13) {
            this.sendCurrent();
            return false;
        }
    },
    sendCurrent: function () {
        var val = this.$input.val(),
            contact = this.model.getRelatedContact();
        if (val && contact) {
            if (contact.get('online')) {
                contact.message(this.$input.val());
                this.$input.val('');                
            } else {
                this.sendCurrentAsSMS();
            }
        }
    },
    sendCurrentAsSMS: function () {
        var val = this.$input.val(),
            contact = this.model.getRelatedContact();
        if (val && contact) {
            contact.sms(this.$input.val());
            this.$input.val('');
            this.model.messages.add({to: contact.id, body: val, me: true, type: 'sms'});
        }
    },
    handleChatSendClick: function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        this.sendCurrent();
    },
    handleSMSSendClick: function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        this.sendCurrentAsSMS();
    },
    handleChangeOnline: function () {
        if (this.contact) {
            this.$('.chatField')[this.contact.get('online') ? 'addClass' : 'removeClass']('online');
        }
    }
});