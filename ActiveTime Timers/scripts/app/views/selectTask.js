define(["kendo", "app/timer", "app/data", "app/utils"], function (kendo, appTimer, data, utils) {
    "use strict";

    var _clientId = 0,
        _clientName = "",
        _projectId = 0,
        _projectName = "";

    return {
        tasks: data.tasks,

        show: function (showEvt) {
            try {
                _clientId = showEvt.view.params.clientId;
                _clientName = decodeURIComponent(showEvt.view.params.clientName);
                _projectId = showEvt.view.params.projectId;
                _projectName = decodeURIComponent(showEvt.view.params.projectName);

                data.tasks.filter([
                    { field: "projectId", operator: "eq", value: +_projectId },
                    { field: "closedOn", operator: "eq", value: undefined }
                ]);
            } catch (ex) {
                utils.hideLoading();
                utils.showError("Error loading tasks.", ex);
            }
        },

        onSelect: function (clickEvt) {
            data.timers.add(appTimer.create({
                clientId: _clientId,
                clientName: _clientName,
                projectId: _projectId,
                projectName: _projectName,
                taskId: clickEvt.dataItem.id,
                taskName: clickEvt.dataItem.name
            }));
            utils.navigate("#timers-view");
        },

        onRefresh: function (clickEvt) {
            data.tasks.read();
        }
    };
});