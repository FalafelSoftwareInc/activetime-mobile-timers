define(["jQuery", "kendo", "app/data", "app/utils", "app/config"], function ($, kendo, data, utils, config) {
    "use strict";

    var _listViewElement = $("#entries-listview"),
        _listViewTemplate = $("#todays-entry-template").text().trim();

    var viewModel = kendo.observable({
        timerTotalDuration: "00:00"
    });

    var updateTotalDuration = function (entries) {
        var totalHours = 0;
        var entriesArray = entries.data();
        for(var i = 0; i < entriesArray.length; i++) {
            totalHours += entriesArray[i].hours;
        }

        var minutes = Math.floor((totalHours % 1) * 60);
        var hours = Math.floor(totalHours);
        var time = (hours > 99 ? hours : kendo.toString(hours, "00")) + ":" + kendo.toString(minutes, "00");
        viewModel.set("timerTotalDuration", time);
    };

    return {
        show: function (showEvt) {
            try {
                var entries = data.todaysEntries();
                var listView = _listViewElement.data().kendoMobileListView;
                if(listView) {
                    listView.destroy();
                }
                
                entries.bind("change", function () { updateTotalDuration(entries); })

                _listViewElement.kendoMobileListView({
                    dataSource: entries,
                    template: _listViewTemplate
                });
            } catch (ex) {
                utils.hideLoading();
                utils.showError("Error loading tasks.", ex);
            }
        },

        displayTime: function (entry) {
            var hours = Math.floor(entry.hours);
            var minutes = Math.round(60 * (entry.hours % 1));
            return (hours > 99 ? hours : kendo.toString(hours, "00")) + ":" + kendo.toString(minutes, "00");
        },

        onOpenTickspot: function () {
            var url = kendo.format("https://{0}.tickspot.com/", config.login.account);
            try {
                utils.openChildBrowser(url);
            } catch (ex) {
                utils.showError("Sorry, there was an error trying to open this external URL: " + url);
            }
        },

        viewModel: viewModel
    };
});