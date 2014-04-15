define(["kendo", "app/timer", "app/data", "app/utils"], function (kendo, appTimer, data, utils) {
    "use strict";

    var filterTimer;
    var viewElement;

    var applyFilter = function (filter) {
        if(filter) {
            data.projects.filter({logic: "or", filters: [{field: "name", operator: "contains", value: filter}, {field: "clientName", operator: "contains", value: filter}]});
        } else {
            data.projects.filter([]);
        }
        utils.scrollViewToTop(viewElement);
    };
    
    return {
        onInit: function (initEvt) {
            viewElement = initEvt.view.element;
        },

        onHide: function () {
            document.getElementById("select-project-filter").blur();
            setTimeout(function(){
                window.scrollTo(0, 0);
            }, 0);
        },

        viewModel: kendo.observable({
            projects: data.projects,
            
            onRefresh: function (clickEvt) {
                data.projects.read();
            },
            
            onFilterChange: function (keyEvt) {
                var filter = keyEvt.target.value;

                if(filterTimer) {
                    clearTimeout(filterTimer);
                }
                
                filterTimer = setTimeout(function () { applyFilter(filter); }, 400);
            }
        })
    };
});