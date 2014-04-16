define(["kendo", "app/timer", "app/data", "app/utils"], function (kendo, appTimer, data, utils) {
    "use strict";

    var _clientName = "",
        _projectId = 0,
        _projectName = "";

    return {
        tasks: data.tasks,

        show: function (showEvt) {
            try {
                _clientName = decodeURIComponent(showEvt.view.params.clientName);
                _projectId = showEvt.view.params.projectId;
                _projectName = decodeURIComponent(showEvt.view.params.projectName);

                data.tasks.filter([
                    { field: "projectID", operator: "eq", value: +_projectId }
                ]);
            } catch (ex) {
                utils.hideLoading();
                utils.showError("Error loading tasks.", ex);
            }
        },

        onSelect: function (clickEvt) {
            data.timers.add(appTimer.create({
                clientName: _clientName,
                projectId: _projectId,
                projectName: _projectName,
                taskId: clickEvt.dataItem.projectBillingCodeID,
                taskName: clickEvt.dataItem.billingCode_Name
            }));
            utils.navigate("#timers-view");
        },

        onRefresh: function (clickEvt) {
            data.getData();
        }
    };
});