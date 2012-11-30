/*global Spinner ui*/
var BaseView = require('views/base'),
    ich = require('icanhaz'),
    phoney = require('phoney'),
    socketManager = require('socketManager'),
    DialerView = require('views/dialer'),
    metrics = require('metrics');


module.exports = BaseView.extend({
    initialize: function () {
        this.bindomatic(this.model, 'change:accessToken', this.handleAccessTokenChange, {trigger: true});
        socketManager.connect();
    },
    render: function (html) {
        this.$el.html(html);
        this.dialog = ui.dialog(this.el).show();
    },
    show: function () {
        // render the main dialog content witout the call button
        var container = ich.loginDialogSMS({footer: false});

        if (app.get('smsauth')) {
            this.dialer = new DialerView();
            this.dialer.on('callable', this.handleCallable, this);
            container.find('.dialerContainer').append(this.dialer.render().el);
            this.render(container);    
        } else {
            this.render(ich.loginDialog());
        }
        this.delegateEvents();
    },
    hide: function () {
        this.dialog && this.dialog.hide();
        if (this.dialer) {
            this.dialer.destroy();
            delete this.dialer;
        }
    },
    handleCallable: function (number) {
        var html = ich.loginWaitingDialog({phone: phoney.stringify(number)});
        this.render(html);
        this.spinner = new Spinner();
        this.spinner.spin(html.find('.spinContainer')[0]);
        socketManager.sendPhone(number);
        return false;
    },
    handleAccessTokenChange: function () {
        var token = app.get('accessToken');
        if (token) {
            this.hide();
            metrics.track('logged in');
        } else {
            this.show();
        }
    }
});
