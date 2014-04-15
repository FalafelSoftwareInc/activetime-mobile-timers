define(["jQuery", "kendo"], function ($, kendo) {
    "use strict";

    /* Custom binding to add/remove a class on an element.
     *
     * Usage:
     *   data-bind="cssClass: { selected: isSelected, awesome: isAwesome}"
     * This would add the class "selected" if the view model's isSelected property evaluates to true,
     * and the same for the "awesome" class.
     */
    kendo.data.binders.cssClass = kendo.data.Binder.extend({
        refresh: function() {
            var key, value, valueToBind, negate;
            var complexPath = this.bindings.cssClass.path;
            
            for(key in complexPath) {
                if(complexPath.hasOwnProperty(key)) {
                    value = complexPath[key];

                    if(value[0] === "!") {
                        negate = true;
                        value = value.substr(1);
                    } else {
                        negate = false;
                    }

                    this.bindings.cssClass.path = value;                    
                    valueToBind = this.bindings.cssClass.get();

                    if(negate ? !valueToBind : valueToBind) {
                        $(this.element).addClass(key);
                    } else {
                        $(this.element).removeClass(key);
                    }
                }
            }
        }
    });
});