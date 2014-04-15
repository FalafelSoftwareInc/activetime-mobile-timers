define([], function () {
    "use strict";

    var loginKey = "TickspotMobileTimer_Login";
    var settingsKey = "TickspotMobileTimer_Settings";
    var timersKey = "TickspotMobileTimer_Timers";
    var versionKey = "TickspotMobileTimer_Version";

    return {
        clear: function () {
            window.localStorage.clear();
        },

        loadVersion: function () {
            return JSON.parse(window.localStorage[versionKey] || "0");
        },

        saveVersion: function (data) {
            window.localStorage[versionKey] = JSON.stringify(data);
        },

        loadLogin: function () {
            return JSON.parse(window.localStorage[loginKey] || "{}");
        },

        saveLogin: function (data) {
            window.localStorage[loginKey] = JSON.stringify(data);
        },

        loadSettings: function () {
            return JSON.parse(window.localStorage[settingsKey] || "{}");
        },

        saveSettings: function (data) {
            window.localStorage[settingsKey] = JSON.stringify(data);
        },

        loadTimers: function () {
            return JSON.parse(window.localStorage[timersKey] || "[]");
        },

        saveTimers: function (data) {
            window.localStorage[timersKey] = JSON.stringify(data);
        }
    };
});