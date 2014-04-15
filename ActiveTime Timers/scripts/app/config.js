define(["kendo", "app/data/local"], function (kendo, localData) {
    "use strict";

    var account = "",
        username = "",
        password = "";

    var init = function (data) {
        account = data.account || "";
        username = data.username || "";
        password = data.password || "";
    };

    var isSet = function () {
        return account && account !== ""
            && username && username !== ""
            && password && password !== "";
    };

    init(localData.loadLogin());

    var login = kendo.observable({
        init: init,
        isSet: isSet,
        account: account,
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