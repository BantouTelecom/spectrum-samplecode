/*global ui google*/
var BaseModel = require('models/baseModel'),
    _ = require('underscore'),
    emailToGravatar = require('gravatar');


module.exports = BaseModel.extend({
    templateHelpers: [
        'presenceJid',
        'gravatar'
    ],
    presenceJid: function () {
        var email = this.get("email");
        if (email) {
            return email.split('@')[0] + '@im.tfoundry.com/' + this.resource();
        } else {
            return '';
        }
    },
    url: function () {
        return '/authproxy/me.json';
    },
    gravatar: function () {
        return app.getSecureGravatarUrlFromEmail(this.get('email'));
    },
    parse: function (attrs) {
        var res = {};
        _.extend(res, attrs.info, {provider: attrs.provider, uid: attrs.uid});
        app.set('gravatar', emailToGravatar(res.email, {fallback: 'https://cardbox.alpha-api.com/img/fallback.png'}));
        return res;
    },
    getMyLocation: function (cb) {
        var self = this;
        $.getJSON('/apiproxy/a1/geo/location/current?access_token=' + app.get('accessToken'), function (data) {
            self.set('location', data);
            if (cb) cb(self.getGmapLatLon());
        });
    },
    getGmapLatLon: function () {
        var loc = this.get('location'),
            lat = loc && loc.location && loc.location.position.latitude,
            lon = loc && loc.location && loc.location.position.longitude;

        if (!lat || !lon) return;

        return new google.maps.LatLng(lat, lon);
    }
});