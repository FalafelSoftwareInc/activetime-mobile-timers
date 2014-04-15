define(["kendo", "app/config", "app/utils", "app/data"], function (kendo, config, utils, data) {
    "use strict";

    return {
        login: function () {
            data.projects.read();
            data.tasks.read();
            utils.navigate("#timers-view");
        },

        viewModel: kendo.observable({
            config: config
        })
    };
});