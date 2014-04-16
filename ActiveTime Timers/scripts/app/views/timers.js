define(["kendo", "app/data", "app/utils", "app/config"], function (kendo, data, utils, config) {
    "use strict";
    
    var idOfTimerHavingNoteEdited;

    var refresh = function () {
        var timers = data.timers.data();
        $.each(timers, function (index, timer) { timer.updateDisplay(); });

        var totalSeconds = 0;
        for(var i = 0; i < timers.length; i++) {
            totalSeconds += timers[i].totalSeconds();
        }

        var minutes = Math.floor((totalSeconds / 60) % 60);
        var hours = Math.floor(totalSeconds / 60 / 60);
        //var seconds = Math.floor(totalSeconds % 60);
        var time = (hours > 99 ? hours : kendo.toString(hours, "00")) + ":" + kendo.toString(minutes, "00");
        viewModel.set("timerTotalDuration", time);
    };

    var viewModel = kendo.observable({
        timers: data.timers,

        onSelected: function (clickEvt) {
            var target = $(clickEvt.target);
            if((target.hasClass("km-detail") || target.parent().hasClass("km-detail"))
                && (!target.hasClass("touch-through") && !target.parent().hasClass("touch-through"))) {
                return false;
            }
            this.onSelected2(clickEvt);
        },

        onSelected2: function (clickEvt) {
            var timer = clickEvt.data;
            var timersArray = data.timers.data();
            for(var i = 0; i < timersArray.length; i++) {
                timersArray[i].stop();
            }
            timer.start();
            refresh();
        },

        isRunning: function (timer) {
            return timer.get("startedAt") !== undefined;
        },

        onStop: function (clickEvt) {
            var timersArray = data.timers.data();
            for(var i = 0; i < timersArray.length; i++) {
                timersArray[i].stop();
            }
            refresh();
        },

        onOpenWeb: function () {
            var url = "http://activetime-mvc.cloudapp.net/App";
            try {
                utils.openChildBrowser(url);
            } catch (ex) {
                utils.showError("Sorry, there was an error trying to open this external URL: " + url);
            }
        },

        timerTotalDuration: "00h00m00s"
    });

    return {
        init: function () {
            data.timers.bind("change", refresh);
        },

        show: function (showEvt) {
            refresh();
        },

        submitTimer: function (e) {
            utils.navigate("#submit-view?timerId=" + encodeURIComponent(e.context));
        },

        deleteTimer: function (e) {
            data.timers.remove(data.timers.getByUid(e.context));
            refresh();
        },

        editNote: function (e) {
            idOfTimerHavingNoteEdited = e.context;
            $("#edit-note-view textarea").val(data.timers.getByUid(idOfTimerHavingNoteEdited).notes);
            var modalWidget = $("#edit-note-view").show().data("kendoMobileModalView");
/*            modalWidget.options.width = kendo.support.screenWidth;
            modalWidget.options.height = kendo.support.screenHeight;
            modalWidget.resize();
*/            modalWidget.open();
            $("#edit-note-view textarea").focus();
        },

        editNoteDone: function (e) {
            data.timers.getByUid(idOfTimerHavingNoteEdited).set("notes", $("#edit-note-view textarea").val());
            $("#edit-note-view").data().kendoMobileModalView.close();
            idOfTimerHavingNoteEdited = undefined;
            $("#edit-note-view textarea").val("");
        },

        refresh: refresh,

        viewModel: viewModel
    };
});