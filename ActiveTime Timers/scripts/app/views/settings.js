define(["jQuery", "kendo", "app/config", "app/utils"], function ($, kendo, config, utils) {
    "use strict";

    return {
        viewModel: config.settings,

        logout: function () {
            config.login.set("username", undefined);
            config.login.set("password", undefined);
            utils.navigate("#login-view");
        }
    };
});