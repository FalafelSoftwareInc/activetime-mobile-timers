define(["kendo", "app/config"], function (kendo, config) {
    "use strict";
    
    var EMPTY_DISPLAY_TIME = "--:--";

    var Timer = kendo.data.ObservableObject.extend({
        init: function (data) {
            kendo.data.ObservableObject.fn.init.call(this);
    
            this.durationSeconds = 0;
            this.displayTime = EMPTY_DISPLAY_TIME;
            this.startedAt = undefined;
            this.notes = "";
            this.date = kendo.toString(new Date(), "yyyy-MM-dd");
            $.extend(this, data);

            // fix date because it is stringified to a string.
            if(typeof this.startedAt === "string") {
                this.startedAt = new Date(this.startedAt);
            }

            this.start = function () {
                if(this.startedAt) {
                    this.stop();
                }
                if(this.durationSeconds === 0) {
                    this.set("date", kendo.toString(new Date(), "yyyy-MM-dd"));
                }
                this.set("startedAt", new Date());
                this.updateDisplay();
            };
    
            this.stop = function () {
                var stoppedAt = new Date();
                if(this.startedAt) {
                    if(config.settings.addTimeStamps && (stoppedAt - this.startedAt) >= 60000) {
                        var newNote = kendo.toString(this.startedAt, "h:mm") + "-" + kendo.toString(stoppedAt, "h:mm");
                        this.set("notes", this.notes + (this.notes.length > 0 ? ", " + newNote : newNote));
                    }
                    this.set("durationSeconds", this.durationSeconds + Math.floor((stoppedAt - this.startedAt) / 1000));
                }
                this.set("startedAt", undefined);
                this.updateDisplay();
            };

            this.updateDisplay = function () {
                if(this.durationSeconds === 0 && this.startedAt === undefined) {
                    this.set("displayTime", EMPTY_DISPLAY_TIME);
                } else {
                    var date = this.toDate();
                    var hours = date.getHours();
                    var time = (hours > 99 ? hours : kendo.toString(hours, "00")) + ":" + kendo.toString(date.getMinutes(), "00");
                    this.set("displayTime", time);
                }
            };

            this.toDate = function () {
                var seconds = this.totalSeconds();

                var minutes = Math.floor((seconds / 60) % 60);
                var hours = Math.floor(seconds / 60 / 60);
                var date = new Date(0);
                date.setHours(hours);
                date.setMinutes(minutes);
                return date;
            };

            this.totalSeconds = function () {
                var seconds = this.get("durationSeconds");
                if(this.startedAt) {
                    seconds += Math.floor((new Date() - this.startedAt) / 1000);
                }
                return seconds;
            };
            
            this.reset = function () {
                this.set("durationSeconds", 0);
                this.set("displayTime", EMPTY_DISPLAY_TIME);
                this.set("startedAt", undefined);
                this.set("notes", "");
                this.set("date", kendo.toString(new Date(), "yyyy-MM-dd"));
            };
            
            this.hasTime = function () {
                return this.get("durationSeconds") > 0 || this.get("startedAt") !== undefined;
            }
        }
    });

    return {
        create: function (data) {
            return new Timer(data);
        }
    };
});