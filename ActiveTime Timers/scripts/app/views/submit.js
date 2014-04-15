define(["jQuery", "kendo", "app/data", "app/utils", "app/config"], function ($, kendo, data, utils, config) {
    "use strict";

    var SECONDS_PER_DAY = 86400000;

    var _timerToSubmit;
    var _submitting = false;
    var _currentViewModel;

    var viewModel = function () {
        return kendo.observable({
            clientName: function () { return _timerToSubmit.get('clientName'); },
            projectName: function () { return _timerToSubmit.get('projectName'); },
            taskName: function () { return _timerToSubmit.get('taskName'); },
            notes: function () { return _timerToSubmit.get('notes'); },
            date: _timerToSubmit.get('date'),

            daysAgo: function () {
                var daysAgo = getDaysAgo(this.get('date'));
                if(daysAgo === 0) {
                    return "Today";
                } else if (daysAgo === 1) {
                    return "Yesterday";
                } else {
                    return daysAgo + " days ago";
                }
            },
            
            isToday: function () {
                return getDaysAgo(this.get('date')) === 0 ? "is-today" : "";
            }
        });
    };
        
    var getDaysAgo = function (dateToCheck) {
        var date = new Date(dateToCheck);
        var thisDay = new Date() / SECONDS_PER_DAY;
        var timerDay = (+date + (date.getTimezoneOffset() * 60)) / SECONDS_PER_DAY;
        return Math.floor(thisDay - timerDay);
    };

    var updateDuration = function () {
        if(!_timerToSubmit) {
            return;
        }

        var durationValue = $("#submit-view .duration").scroller('getDate');

        _timerToSubmit.set("startedAt", undefined);
        _timerToSubmit.set('durationSeconds', (durationValue.getHours() * 60 * 60) + (durationValue.getMinutes() * 60));
        _timerToSubmit.updateDisplay();
    };

    var updateNotes = function () {
        if(!_timerToSubmit) {
            return;
        }

        _timerToSubmit.set('notes', $("#submit-view textarea").val());
    };
    
    var updateDate = function () {
        if(!_timerToSubmit) {
            return;
        }
        
        _timerToSubmit.set('date', _currentViewModel.get("date"));
    };

    return {
        viewModel: function () { return _currentViewModel; },

        init: function (initEvt) {
            $("#submit-view .duration").scroller({
                theme: 'default',
                mode: 'scroller',
                display: 'inline',
                lang: 'en',
                preset : 'time',
                timeWheels: 'Hii',
                hourText: 'Hours',
                minuteText: 'Minutes'
            });
        },

        show: function (showEvt) {
            _submitting = false;
            var timerId = showEvt.view.params.timerId;
            _timerToSubmit = data.timers.getByUid(timerId);
            $("#submit-view .duration").scroller('setDate', _timerToSubmit.toDate(), false);
            _currentViewModel = viewModel();
            kendo.bind(showEvt.view.element, _currentViewModel, "kendo.mobile.ui");
        },

        onSubmit: function () {
            if(_submitting) {
                return;
            }
            var onSuccess = function () {
                _submitting = false;
                if(config.settings.keepTimers) {
                    _timerToSubmit.reset();
                } else {
                    data.timers.remove(_timerToSubmit);
                }
                _timerToSubmit = undefined;
                utils.navigate("#timers-view");
            };
            _submitting = true;
            _timerToSubmit.stop();
            updateDuration();
            updateDate();
            updateNotes();
            data.createEntry(_timerToSubmit, onSuccess);
        },

        hide: function () {
            updateDuration();
            updateDate();
            updateNotes();
        }
    };
});