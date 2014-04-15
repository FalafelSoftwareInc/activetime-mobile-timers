try
{
    require.config({
        paths: {
            jQuery: "../kendo/js/jquery.min",
            mobiscroll: "libs/mobiscroll.datetime-2.4.min",
            kendo: "../kendo/js/kendo.mobile.min"
        },
        shim: {
            jQuery: {
                exports: "jQuery"
            },
            mobiscroll: {
                deps: ["jQuery"],
                exports: "jQuery"
            },
            kendo: {
                deps: ["jQuery"],
                exports: "kendo"
            }
        }
    });
    
    var app;
    var isDeviceReady = false;
    document.addEventListener("deviceready", function () { isDeviceReady = true; }, false);

    require(["app/app"], function (application) {
        $(function() {
            app = application;
            app.init();
        });
    });
} catch (ex) {
    var errElement = jQuery("#error-view");
    errElement.html("Fatal Error: " + JSON.stringify(ex));
    errElement.show();
}