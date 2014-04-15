define(["jQuery", "kendo", "app/config", "app/utils", "app/data"], function ($, kendo, config, utils, data) {
    "use strict";

    return {
        login: function () {
            data.login().done(function () {
                data.getData(new Date());
	            utils.navigate("#timers-view");
            });
        },

        viewModel: kendo.observable({
            config: config
        })
    };
});