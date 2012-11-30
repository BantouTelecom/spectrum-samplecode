var BaseView = require('views/base'),
    ich = require('icanhaz'),
    _ = require('underscore'),
    phoney = require('phoney'),
    callManager = require('callManager'),
    Backbone = require('backbone');


module.exports = BaseView.extend({
    events: {
        'click #dialpad button': 'handleNumberClick',
        'touchstart #dialpad button': 'handleNumberClick',
        'click .call': 'handleCallClick',
        'touchstart .call': 'handleCallClick'
    },
    //This ties .numberToCall with number but we need it to work backwards too
    inputBindings: {
        'number': '.numberToCall'
    },
    initialize: function () {
        this.model = new Backbone.Model();
        this.model.set('number', '');
        this.model.on('change:number', this.handleNumberChange, this);
    },
    render: function (showCallButton) {
        this.setElement(ich.dialer({footer: !!showCallButton}));
        // we don't want to allow direct manipulation as an input
        this.handleBindings();
        this.on('destroy', function () {
            $(document).off('keydown');
        });
        $(document).on('keydown', _.bind(this.handleKeyDown, this));
        return this;
    },
    addNumber: function (number) {
        var newNumber = (this.model.get('number') + '') + number,
            callable = phoney.getCallable(newNumber);
        this.model.set('number', newNumber);
        if (callable) {
            this.trigger('callable', callable);
        } else {
            this.trigger('notCallable', newNumber);
        }
    },
    clearNumber: function () {
        this.model.set('number', '');
    },
    handleKeyDown: function (e) {
        var number,
            keyCode = e.which;
        // only handle if dialer is showing
        if (keyCode >= 48 && keyCode <= 57) {
            number = keyCode - 48;
            this.addNumber(number);
        }

        if (keyCode === 8) {
            this.removeLastNumber();
            e.preventDefault();
        }
    },
    removeLastNumber: function () {
        this.model.set('number', this.model.get('number').slice(0, -1));
    },
    handleNumberClick: function (e) {
        var container = $(e.target).is('button') ? $(e.target) : $(e.target).parents('button'),
            value = container.data('value');
        e.preventDefault();

        if (value === 'del') {
            this.removeLastNumber();
        } else {
            this.addNumber(value);
        }
    },
    handleNumberChange: function () {
        this.$('.numberEntry').text(phoney.stringify(this.model.get('number')));
    },
    handleCallClick: function (e) {
        e.preventDefault();
        callManager.startPhoneCall(phoney.getCallable(this.model.get('number')));
        this.dialog.hide();
        return false;
    }
});
