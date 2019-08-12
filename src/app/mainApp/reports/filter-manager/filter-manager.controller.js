/*
 * Filters object
 *  filters:{
 *      query:value
 *  }
 *  Example:
 *  filters:{
 *      field__property__filter_type:{{filterValue}}
 *  }
 */

(function () {
    angular
        .module('app.mainApp.reports')
        .component('filterManager', {
            templateUrl: 'app/mainApp/reports/filter-manager/filter-manager.tmpl.html',
            controller: filterManagerController,
            controllerAs: 'vm',
            bindings: {
                //Main Parameters
                filters: '<',      //The filter array returned by the API
                queries: '=',      //Bidirectional binding for the query parameters object, should be passed as an empty array
                //Button Labels
                addButton: '<',    //Default is "Add"
                removeButton: '<', //Default is "Remove"
                modifyButton: '<', //Default is "Modify"
                //Field labels
                fieldLabel: '<',    //Default is "field"
                propertyLabel: '<', //Default is "property"
                filtersLabel: '<',  //Default is "Filter to apply"
                valueLabel: '<'     //Default is "value"
            }
        });

    function filterManagerController(
        //$log
    ) {
        var vm = this;

        //Globals
        vm.appliedFilters;
        /*
         * {
         *      query: string,
         *      verbose: string
         * }
         */

        var init = function () {
            vm.appliedFilters = [
                {
                    query: "this is the query",
                    verbose: "a verbose for the filter"
                }
            ];
        };
        init();


    }
})();
