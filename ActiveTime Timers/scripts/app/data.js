define(["jQuery", "kendo", "app/config", "app/utils", "app/data/models", "app/timer", "app/data/local"], function ($, kendo, config, utils, dataModels, timer, localData) {
    "use strict";

    $.ajaxSetup({
		error:function(x,e){
			if (x.status == 0) {
			    utils.showError('You are offline!!n Please Check Your Network.');
			} else if (x.status == 404) {
			    utils.showError('Requested URL not found.');
			} else if (x.status == 500) {
			    utils.showError('Internel Server Error.');
			} else if (e == 'parsererror') {
			    utils.showError('Parsing JSON Request failed.');
			} else if (e == 'timeout') {
			    utils.showError('Request Time out.');
			} else {
			    utils.showError('Unknow Error. ' + x.responseText);
			}
		}
	});
    
    var _onRequestStart = function (event) {
        if ( !utils.isOnline() ) {
            utils.showOffline();
            event.preventDefault();
            return false;
        }
    };
    
    var _serviceUrl = function (controller) {
        return kendo.format("https://{0}.tickspot.com/api/{1}",
                            config.login.account,
                            controller);
    };

    var _serviceLoginData = function (data) {
        return $.extend({
            email: config.login.username,
            password: config.login.password
        }, data || {});
    };

    var _onTimersChanged = function () {
        localData.saveTimers($.map(timers.data(), function (x) {
            var plain = x.toJSON();
            if(plain.startedAt) {
                plain.startedAt = plain.startedAt.getTime();
            }
            return plain;
        }));
    };

    var _onError = function (e) {
        console.log(e);
        utils.hideLoading();
        utils.showError(e.errorThrown || e.responseText || JSON.stringify(e));
    };

    var savedTimers = new kendo.data.ObservableArray(localData.loadTimers());
    var timers = new kendo.data.DataSource({
        data: []
    });
    for(var i = 0; i < savedTimers.length; i++) {
        var savedTimer = savedTimers[i];
        if(savedTimer.startedAt) {
            savedTimer.startedAt = new Date(savedTimer.startedAt);
        }
        timers.add(timer.create(savedTimer));
    }
    timers.bind("change", _onTimersChanged);

    return {
        recentProjects: new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () { return _serviceUrl("recent_tasks"); },
                    type: "GET",
                    dataType: "xml",
                    data: _serviceLoginData
                }
            },
            schema: dataModels.recentProjects,
            error: _onError,
            requestStart: _onRequestStart
        }),

        timers: timers,

        projects: new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () { return _serviceUrl("projects"); },
                    type: "GET",
                    dataType: "xml",
                    data: function () {
                        return _serviceLoginData({
                            open: "true"
                        });
                    }
                }
            },
            schema: dataModels.projects,
            filter: { field: "closedOn", operator: "eq", value: undefined },
            group: [{ field: "clientName" }],
            sort: [{ field: "clientName"}, {field: "name"}],
            error: _onError,
            requestStart: _onRequestStart
        }),

        tasks: new kendo.data.DataSource({
            transport: {
                read: {
                    url: function () { return _serviceUrl("clients_projects_tasks"); },
                    type: "GET",
                    dataType: "xml",
                    data: function () {
                        return _serviceLoginData();
                    }
                }
            },
            schema: dataModels.tasks,
            sort: [{ field: "position"}],
            error: _onError,
            requestStart: _onRequestStart
        }),

        getClientNameById: function (clientId) {
            var clients = clientsDataSource.data();
            for(var i = 0; i < clients.length; i++) {
                if(clients[i].id === clientId) {
                    return clients[i].name;
                }
            }
            return "(Unknown)";
        },

        createEntry: function (timer, success) {
            var entryData = _serviceLoginData({
                task_id: timer.taskId,
                hours: kendo.toString(timer.durationSeconds / 60 / 60, "n2"),
                date: timer.date || kendo.toString(new Date(), "yyyy-MM-dd"),
                notes: timer.notes || ""
            });
            if ( !utils.isOnline() ) {
                utils.showOffline();
                return;
            }
            utils.showLoading();
            $.post(_serviceUrl("create_entry"), entryData)
                .done(function () { utils.hideLoading(); success(); })
                .fail(function () { utils.hideLoading(); console.log("error while submitting.", arguments); });
        },

        todaysEntries: function () {
            return new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () { return _serviceUrl("entries"); },
                        type: "GET",
                        dataType: "xml",
                        data: function () {
                            var start = new Date();
                            var end = new Date();
                            start.setHours(0,0,0,0);
                            end.setHours(24,0,0,0);

                            return _serviceLoginData({
                                user_email: config.login.username,
                                start_date: kendo.toString(start, "u"),
                                end_date: kendo.toString(end, "u")
                            });
                        }
                    }
                },
                schema: dataModels.todaysEntries(),
                error: _onError,
                requestStart: _onRequestStart
            });
        }
    };
});