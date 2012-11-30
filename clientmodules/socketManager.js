/*
This module's only job is managing our socket.io connection that was use for authentication.
*/
module.exports = {
    connect: function () {
        if (!this.socket || !this.socket.connected) {
            this.socket = io.connect('https://spectrum.io:443');
            //this.socket = io.connect();
            this.socket.on('token', function (token) {
                app.set('accessToken', token);
                app.getData(function () {});
            });
        }
    },
    sendPhone: function (number) {
        this.socket.emit('phone', number);
    },
    disconnect: function () {
        this.socket.disconnect();
    }
};