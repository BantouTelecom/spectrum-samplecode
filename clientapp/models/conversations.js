var BaseCollection = require('models/baseCollection'),
    Conversation = require('models/conversation');


module.exports = BaseCollection.extend({
    model: Conversation,
    initialize: function () {
        //
    },
    parse: function (response) {
        return response.messages;
    },
    show: function () {
        app.showConversation(this);
    },
    getOrNew: function (id) {
        var convo = this.get(id);
        if (!convo) {
            convo = new Conversation({id: id});
            this.add(convo);
        }
        return convo;
    }
});