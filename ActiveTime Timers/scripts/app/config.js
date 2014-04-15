define(["kendo", "app/data/local"], function (kendo, localData) {
    "use strict";

    var username = "",
        password = "";

    var init = function (data) {
        username = data.username || "";
        password = data.password || "";
    };

    var isSet = function () {
        return username && username !== ""
            && password && password !== "";
    };

    init(localData.loadLogin());

    var login = kendo.observable({
        init: init,
        isSet: isSet,
        username: username,
        password: password
    });

    var settings = kendo.observable(localData.loadSettings());

    login.bind("change", function () { localData.saveLogin(login); });
    settings.bind("change", function () { localData.saveSettings(settings); });

    return {
        login: login,
        settings: settings,

        clear: function () {
            localData.clear();
        },

        getVersion: function () {
            return localData.loadVersion();
        },

        setVersion: function (ver) {
            localData.saveVersion(ver);
        }
    };
});