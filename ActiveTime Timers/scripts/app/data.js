define(["jQuery", "kendo", "app/config", "app/utils", "app/timer", "app/data/local"], function ($, kendo, config, utils, timer, localData) {
    "use strict";
    
    var BASE_URL = "http://activetime-mvc.cloudapp.net/";

    var dsBillingCodes = new kendo.data.DataSource({
        data: [],
        sort: [{ field: "billingCode_Name"}]
    });
    var dsProjects = new kendo.data.DataSource({
        data: [],
        group: [{ field: "parent_Project_Name" }],
        sort: [{ field: "parent_Project_Name"}, {field: "project_Name"}]
    });

    $.ajaxSetup({
		error:function(x,e){
			if (x.status == 0) {
			    utils.showOffline();
			} else if (x.status == 401) {
			    utils.showError('Invalid Login.');
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
        return true;
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
        timers: timers,
        projects: dsProjects,
        tasks: dsBillingCodes,

        createEntry: function (timer, success) {
            //{"projectWorkerTimes":[{"projectID":20,"date":"2014-04-16","hours":0,"description":"(test / delete me)","projectBillingCodeID":25,"referenceNo":"","id":0}]}
            var entryData = {
                projectWorkerTimes: [{
                    id: 0,
                    projectID: timer.projectId,
                    projectBillingCodeID: timer.taskId,
                    hours: kendo.toString(timer.durationSeconds / 60 / 60, "n2"),
                    date: timer.date || kendo.toString(new Date(), "yyyy-MM-dd"),
                    description: timer.notes || "",
                    referenceNo: ""
                }]
            };
            if ( !utils.isOnline() ) {
                utils.showOffline();
                return;
            }
            utils.showLoading();
            $.ajax({
                type: "POST",
				contentType: "application/json",
				url: BASE_URL + "api/projectworkertime",
                data: kendo.stringify(entryData),
                success: function () { utils.hideLoading(); success(); },
                error: function () { utils.hideLoading(); console.log("error while submitting.", arguments); }
            });
        },
        
        todaysEntries: function () {
            var date = new Date();
			var expand = "[ProjectWorkerTimes,WorkerProjects,ProjectBillingCodes]";
            var parentProjectIds = {};
            var projectIds = {};
            var billingCodes = {};
            var resultData = new kendo.data.DataSource({data:[]});

            if(!_onRequestStart()) {
                return resultData;
            }

            utils.showLoading();
			$.ajax({
				type: "GET",
				contentType: "application/json",
				url: BASE_URL + "api/workerperiod",
				cache: false,
				data: {
					Date: kendo.toString(date, 'yyyy-MM-dd'),
					Expand: expand
				},
				success: function (response) {
                    var result;
                    var today = kendo.toString(new Date(), "yyyy-MM-dd");
            		$.each(response.projectBillingCodes, function (index, item) {
                        billingCodes[item.projectBillingCodeID.toString()] = item.billingCode_Name;
                    });
            		$.each(response.workerProjects, function (index, item) {
                        parentProjectIds[item.projectID.toString()] = item.parent_Project_Name;
                        projectIds[item.projectID.toString()] = item.project_Name;
                    });
                    result = $.map(response.projectWorkerTimes, function (item) {
                        if(item.date.indexOf(today) === 0) {
                            return timer.create({
                                clientName: parentProjectIds[item.projectID.toString()],
                                projectId: item.projectID,
                                projectName: projectIds[item.projectID.toString()],
                                taskId: item.projectBillingCodeID,
                                taskName: billingCodes[item.projectBillingCodeID.toString()],
                                notes: item.description,
                                durationSeconds: item.hours * 60 * 60
                            });
                        } else {
                            return undefined;
                        }
					});
                    resultData.data(result);
                    utils.hideLoading();
				}
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
                utils.hideLoading();
				if (jqXHR.status === 401) {
                    utils.showError("Invalid Login.");
					config.login.set("username", undefined);
                    config.login.set("password", undefined);
                    utils.navigate("#login-view");
				} else {
                    utils.showError(errorThrown);
                }
			});
            return resultData;
        },
        
        login: function () {
            var deferred = $.Deferred();
            if(!_onRequestStart()) {
                deferred.fail();
                return deferred;
            }
            utils.showLoading();
            $.ajax({
    			type: "POST",
    			url: BASE_URL + "auth/credentials",
    			data: "userName=" + encodeURIComponent(config.login.username) + "&password=" + encodeURIComponent(config.login.password),
    			dataType: "json",
    			cache: false,
    			success: function (data, status, xhr) {
                    utils.hideLoading();
                    deferred.resolve();
    				//location.replace(jqLogin.data("redirect"));
    			}
    		}).fail(function (jqXHR, textStatus, errorThrown) {
                utils.hideLoading();
    			_onError(errorThrown);
                deferred.fail();
    		});
            return deferred.promise();
        },

		getData: function (date) {
			var expand = "[WorkerProjects,ProjectBillingCodes]";

            if(!_onRequestStart()) {
                return;
            }

            utils.showLoading();
			return $.ajax({
				type: "GET",
				contentType: "application/json",
				url: BASE_URL + "api/workerperiod",
				cache: false,
				data: {
					Date: kendo.toString(date, 'yyyy-MM-dd'),
					Expand: expand
				},
				success: function (response) {
					if (response.projectBillingCodes) {
						dsBillingCodes.data(response.projectBillingCodes);
					}
					if (response.workerProjects) {
						dsProjects.data(response.workerProjects);
					}
                    utils.hideLoading();
				}
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
                utils.hideLoading();
				if (jqXHR.status === 401) {
                    utils.showError("Invalid Login.");
					config.login.set("username", undefined);
                    config.login.set("password", undefined);
                    utils.navigate("#login-view");
				} else {
                    utils.showError(errorThrown);
                }
			});
		}
    };
});