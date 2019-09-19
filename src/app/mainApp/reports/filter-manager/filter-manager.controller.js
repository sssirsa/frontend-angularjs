/*
 * Filters object
 *  filters:{
 *      query:value
 *  }
 *  Example:
 *  filters:{
 *      field__property__filter_type:{{filterValue}}
 *  }
 *
 * Filter TRanslations object
 * filterTranslations:{
 *      filterType: 'translation'
 * }
 *
 * Example
 * filterTranslations:{
 *      not: 'different from'
 * }
 *  
 */

(function () {
    angular
        .module('app.mainApp.reports')
        .filter('translateFilter', function(Translate) {
            var filterTranslations = {
                not:Translate.translate('REPORT_META.REQUEST.FILTERS.NOT'),
                gt:Translate.translate('REPORT_META.REQUEST.FILTERS.GT'),
                lt:Translate.translate('REPORT_META.REQUEST.FILTERS.LT'),
                gte:Translate.translate('REPORT_META.REQUEST.FILTERS.GTE'),
                lte:Translate.translate('REPORT_META.REQUEST.FILTERS.LTE'),
                contains:Translate.translate('REPORT_META.REQUEST.FILTERS.CONTAINS'),
                icontains:Translate.translate('REPORT_META.REQUEST.FILTERS.ICONTAINS'),
                startswith:Translate.translate('REPORT_META.REQUEST.FILTERS.STARTSWITH'),
                istartswith:Translate.translate('REPORT_META.REQUEST.FILTERS.ISTARTSWITH'),
                equals: Translate.translate('REPORT_META.REQUEST.FILTERS.EQUALS')
            };
            return function(input) {
                return filterTranslations[input];
            };
        })
        .component('filterManager', {
            templateUrl: 'app/mainApp/reports/filter-manager/filter-manager.tmpl.html',
            controller: filterManagerController,
            controllerAs: 'vm',
            bindings: {
                //Main Parameters
                filters: '<',      //The filter array returned by the API
                queries: '=',      //Bidirectional binding for the query parameters object, should be passed as an empty object
                //Button Labels
                addButton: '<',    //Default is "Add"
                removeButton: '<', //Default is "Remove"
                modifyButton: '<', //Default is "Modify"
                cancelButton: '<', //Default is "Cancel"
                saveButton: '<',   //Default is "Save"
                //Field labels
                fieldLabel: '<',    //Default is "Field"
                propertyLabel: '<', //Default is "Property"
                filtersLabel: '<',  //Default is "Filter to apply"
                valueLabel: '<'     //Default is "Value"
            }
        });

    function filterManagerController(
        $filter
    ) {
        var vm = this;

        //Constructors
        vm.template = function template() {
            var vm = this;
            vm.query = '';
            vm.verbose = '';
            vm.filter = {
                field: {
                    name: '',
                    property_name: '',
                    filter_type: '',
                    value: ''
                }
            };
        };

        //Globals
        vm.queryResult = '';
        vm.queryPropertyResult = null;
        vm.queryValueResult = null;
        vm.newComponent = true;
        vm.translatedFilters = null;

        //Standarized filters array
        vm.appliedFilters = [];
        vm.editingIndex = -1;

        //Functions
        vm.cleanModels = function cleanModels() {
            vm.queryPropertyResult = null;
        };

        vm.cancelAddModify = function cancelAddModify() {
            vm.queryResult = '';
            vm.queryPropertyResult = null;
            vm.queryValueResult = null;
            vm.editingIndex = -1;
        };

        vm.removeFilter = function removeFilter(index) {
            vm.appliedFilters.splice(index, 1);
            vm.queries = vm.appliedFilters;
        };

        //Called for enabling the adding filter feature
        vm.addFilter = function addFilter() {
            if (vm.appliedFilters.length) {
                vm.editingIndex = vm.appliedFilters.length;
            }
            else {
                vm.editingIndex = 0;
            }
        };

        vm.getFinalQuery = function getFinalQuery() {
            var string = vm.queryResult + vm.queryPropertyResult;
            var verbose = 'Filtro: "' + vm.queryResult.replace(/__/g,' -> ') + $filter('translateFilter')(vm.queryPropertyResult) + '"';
            verbose += ' Valor: "' + vm.queryValueResult + '"';
            vm.appliedFilters.push({'query':string, 'value': vm.queryValueResult, 'verbose':verbose});
            vm.queries = vm.appliedFilters;
        };

        vm.saveFilter = function saveFilter() {
            vm.getFinalQuery();
            vm.queryResult = '';
            vm.queryPropertyResult = null;
            vm.queryValueResult = null;
            vm.editingIndex = -1;
        };

    }

})();
