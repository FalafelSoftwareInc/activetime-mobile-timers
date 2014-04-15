define(["jQuery"], function ($) {
    "use strict";

    var _kendoApp;

    return {
        init: function (kendoApp) {
            _kendoApp = kendoApp;
        },

        navigate: function (view) {
            _kendoApp.navigate(view);
        },

        showError: function (message, error) {
            console.error(message, error);
            try {
                //var errorMessage = message + (error === undefined ? "" : "\n" + error.status + ": " + error.statusText);
                var errorMessage = "There was an error performing this action.\nPlease make sure your login information is correct.";
                $("#error-view .error-header").show();
                $("#error-view .message").text(errorMessage);
                $("#error-view").show().data().kendoMobileModalView.open();
            } catch (e) {
                console.error(e);
            }
        },

        closeError: function () {
            $("#error-view").data().kendoMobileModalView.close();
        },

        showLoading: function () {
            _kendoApp.showLoading();
        },

        hideLoading: function () {
            _kendoApp.hideLoading();
        },

        openChildBrowser: function (url) {
            window.open(url, "_blank");
        },
        
        isOnline: function () {
            return navigator.connection.type != Connection.NONE;
        },
        
        showOffline: function (message) {
            this.hideLoading();
            this.showError("No network connection available. Please try again when online.");
        },

        scrollViewToTop: function (viewElement) {
            viewElement.data("kendoMobileView").scroller.reset();
        }
    };
});