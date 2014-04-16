define(["jQuery", "kendo", "app/config", "app/utils", "app/data"], function ($, kendo, config, utils, data) {
    "use strict";

    var model =  {
        login: function () {
            data.login().done(function () {
                data.getData(new Date());
	            utils.navigate("#timers-view");
            }).fail(function () {
                utils.showError("Login Failure.");
            });
        },
        
        show: function () {
            if(config.login.isSet()) {
                model.login();
            }
        },

        viewModel: kendo.observable({
            config: config
        })
    };
    
    return model;
});