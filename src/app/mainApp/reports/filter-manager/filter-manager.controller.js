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
         *      //Field can or can't have the property field,
         *      //in case it doesn't, the filter field and value  properties
         *      //are at the same level of the field_name
         * [
         *      {
         *           query: string,
         *           verbose: string,
         *           filter: {
         *               field: {
         *                   name: 'field_name',
         *                   property: {
         *                       name: 'property_name',
         *                       filter: '',
         *                       value: ''
         *                   }
         *               }
         *           }
         *      },
         *      {
         *           query: string,
         *           verbose: string,
         *           filter: {
         *               field: {
         *                   name: 'field_name',
         *                   filter: '',
         *                   value: ''
         *               }
         *           }
         *      }
         * ]
         */

        var init = function () {
            //Demo data
            //vm.appliedFilters=[];
            vm.appliedFilters = [
                {
                    query: "field_name__property_name__contains=value",
                    verbose: "La propiedad 'property_name' del campo 'field_name' contiene 'value'",
                    filter: {
                        field: {
                            name: 'field_name',
                            property: {
                                name: 'property_name',
                                filter: 'contains',
                                value: 'value'
                            }
                        }
                    }
                },
                {
                    query: "field_name=value",
                    verbose: "El campo 'field_name' es igual a 'value'",
                    filter: {
                        field: {
                            name: 'field_name',
                            filter: 'equals',
                            value: 'value'
                        }
                    }
                }
            ];
        };
        init();

        //Functions

        vm.modifyFilter = function modifyFilter(index) {
            return index;
        };

        vm.removeFilter = function removeFilter(index) {
            vm.appliedFilters.splice(index, 1);
        };

    }
})();
