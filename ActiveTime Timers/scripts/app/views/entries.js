define(["jQuery", "kendo", "app/data", "app/utils", "app/config"], function ($, kendo, data, utils, config) {
    "use strict";

    var _listViewElement = $("#entries-listview"),
        _listViewTemplate = $("#todays-entry-template").text().trim();

    var viewModel = kendo.observable({
        timerTotalDuration: "00:00"
    });

    var updateTotalDuration = function (entries) {
        var totalSeconds = 0;
        var entriesArray = entries.data();
        for(var i = 0; i < entriesArray.length; i++) {
            totalSeconds += entriesArray[i].durationSeconds;
        }

        var minutes = Math.floor((totalSeconds % (60*60)) / 60);
        var hours = Math.floor(totalSeconds / (60*60));
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

        onOpenWeb: function () {
            var url = "http://activetime-mvc.cloudapp.net/App";
            try {
                utils.openChildBrowser(url);
            } catch (ex) {
                utils.showError("Sorry, there was an error trying to open this external URL: " + url);
            }
        },

        viewModel: viewModel
    };
});