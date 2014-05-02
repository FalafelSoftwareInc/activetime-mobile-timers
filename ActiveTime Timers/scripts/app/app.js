define(["jQuery", "mobiscroll", "kendo", "../libs/kendo.binder.cssClass", "app/config", "app/utils", "app/views/timers", "app/views/login", "app/views/settings", "app/views/selectProject", "app/views/selectTask", "app/views/submit", "app/views/entries"],
    function ($,   mobiscroll,   kendo,   classBinder,                     config,       utils,       timersView,         loginView,         settingsView,         selectProjectView,         selectTaskView,         submitView,         entriesView) {
    "use strict";

    var VERSION = "1.0"; // change this when there is a change that breaks the existing saved settings or data.
    var _intervalId = undefined;

    var _update = function () {
        timersView.refresh();
    };

    var _startMasterTimer = function () {
        if(!_intervalId) {
            _intervalId = setInterval(_update, 5000);
        }
    };

    var _stopMasterTimer = function () {
        if(_intervalId) {
            clearInterval(_intervalId);
            _intervalId = undefined;
        }
    };

    var _onPause = function () {
        _stopMasterTimer();
    };

    var _onResume = function () {
        _update();
        _startMasterTimer();
    };

    var _onDeviceReady = function () {
        document.addEventListener("pause", _onPause, false);
        document.addEventListener("resume", _onResume, false);
    };

    var _onError = function (error, url, line) {
        console.log(error, url, line);
        utils.showError(error);
    };

    var _clearLocalDataIfNewVersion = function () {
        if(VERSION !== config.getVersion()) {
            config.clear();
            config.setVersion(VERSION);
        }
    };

    return {
        closeErrorModal: utils.closeError,
        init: function () {
            window.onerror = _onError;
            _clearLocalDataIfNewVersion();

            if(isDeviceReady) {
                _onDeviceReady();
            } else {
                document.addEventListener("deviceready", _onDeviceReady, false);
            }

            var kendoApp = new kendo.mobile.Application($("body"), {
                transition: "slide",
                layout: "tabstrip",
                initial: "login-view",
                skin: window.device.platform === "iOS" ? undefined : "flat"
            });
            utils.init(kendoApp);

            _startMasterTimer();
        },
        views: {
            timers: timersView,
            login: loginView,
            settings: settingsView,
            selectProject: selectProjectView,
            selectTask: selectTaskView,
            submit: submitView,
            entries: entriesView
        }
    }
});