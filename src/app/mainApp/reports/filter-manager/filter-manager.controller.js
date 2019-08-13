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
                cancelButton: '<', //Default is "Cancel"
                saveButton: '<',   //Default is "Save"
                //Field labels
                fieldLabel: '<',    //Default is "Field"
                propertyLabel: '<', //Default is "Property"
                filtersLabel: '<',  //Default is "Filter to apply"
                valueLabel: '<',     //Default is "Value"
                filterTranslations: '<' //Default is no translations
            }
        });

    function filterManagerController(
        //$log
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

        //Auxiliary variables for creating and modifying filters
        vm.rootFields;
        vm.propertiesOfField;
        //Extracted directly from the API as a string array
        vm.filterTypes;
        //Converted to a key-value pair to handle filter ans translation
        vm.translatedFilters;

        //Used when modifying

        vm.originalFilter;

        //Standarized filters array
        vm.appliedFilters;
        vm.editingIndex;

        var init = function () {
            //Demo data
            //vm.appliedFilters=[];
            vm.appliedFilters = [];
            vm.editingIndex = -1;
            vm.rootFields = Object.keys(vm.filters);
        };
        init();

        //Functions

        //Called for enabling filter modification
        vm.modifyFilter = function modifyFilter(index) {
            vm.editingIndex = index;
            vm.originalFilter = angular.copy(vm.appliedFilters[vm.editingIndex]);
        };

        vm.cancelAddModify = function cancelAddModify(index) {
            vm.editingIndex = -1;
            vm.propertiesOfField = null;
            vm.filterType = null;
            vm.translatedFilters = null;
            if (!vm.originalFilter) {
                //Was not editing
                vm.appliedFilters.splice(index, 1);
            }
            else {
                //Was editing
                angular.copy(vm.originalFilter, vm.appliedFilters[index]);
            }
            vm.originalFilter = null;
        };

        vm.removeFilter = function removeFilter(index) {
            vm.appliedFilters.splice(index, 1);
        };

        //Called for enabling the adding filter feature
        vm.addFilter = function addFilter() {
            if (vm.appliedFilters.length) {
                vm.editingIndex = vm.appliedFilters.length;
            }
            else {
                vm.editingIndex = 0;
            }
            vm.appliedFilters.push(new vm.template());
        };

        vm.getPropertiesOfField = function getPropertiesOfField(field) {
            //A field has been selected
            if (field) {
                if (vm.filters[field].filter) {
                    //Has property filter
                    //AKA: No properties nested at this level
                    if (vm.filters[field].filter.length) {
                        //Filters are defined a this level
                        vm.filterTypes = vm.filters[field].filter;
                        if (!vm.filterTypes.push) {
                            //Is not an array
                            vm.filterTypes = [];
                        }
                        vm.filterTypes.unshift('equals');
                        translateFilters();
                    }
                    else {
                        //Filter has subproperties inside filter property
                        vm.propertiesOfField = Object.keys(vm.filters[field].filter);
                    }
                }
                else {
                    //Properties nested at this level
                    vm.propertiesOfField = Object.keys(vm.filters[field]);
                }
            }
        };

        vm.setFiltersFromProperty = function setFiltersFromProperty(index) {
            var rootTemplate = vm.appliedFilters[index];
            var rootFilter = vm.filters[rootTemplate.filter.field.name];
            if (rootFilter.filter) {
                //Has property filter
                //AKA: No properties nested at this level
                if (!rootFilter.filter.length) {
                    //Filter has subproperties inside filter property
                    vm.filterTypes = rootFilter.filter[rootTemplate.filter.field.property_name];
                }
            }
            else {
                //Properties nested at this level
                vm.filterTypes = rootFilter[rootTemplate.filter.field.property_name].filter;
            }
            vm.filterTypes.unshift('equals');
            translateFilters();
        };

        vm.saveFilter = function saveFilter(index) {
            generateVerbose(index);
            generateQuery(index);
            vm.propertiesOfField = null;
            vm.filterType = null;
            vm.translatedFilters = null;
            vm.editingIndex = -1;
        };

        //Internal functions

        var translateFilters = function translateFilters() {
            if (vm.filterTypes.length) {
                //Has elements to iterate
                //Var initialize
                vm.translatedFilters = [];
                if (vm.filterTranslations) {
                    //You can translate the filters
                    angular.forEach(vm.filterTypes, function (filterType) {
                        if (vm.filterTranslations[filterType]) {
                            //The translation for the filter exist
                            vm.translatedFilters.push({
                                value: filterType,
                                verbose: vm.filterTranslations[filterType]
                            });
                        }
                        else {
                            //No translation available so just put
                            //the same value as the filter in the verbose
                            vm.translatedFilters.push({
                                value: filterType,
                                verbose: filterType
                            });
                        }
                    });
                }
                else {
                    //Can't translate so assing the same value to the filter
                    angular.forEach(vm.filterTypes, function (filterType) {
                        vm.translatedFilters.push({
                            value: filterType,
                            verbose: filterType
                        });
                    });
                }
            }
        };

        var generateVerbose = function generateVerbose(index) {
            var verbose = '';
            var filterToApply = vm.appliedFilters[index].filter.field;
            if (filterToApply.name) {
                vm.fieldLabel ? verbose += vm.fieldLabel + ': ' : verbose += 'Field: ';
                verbose += filterToApply.name + ',';
            }
            if (filterToApply.property_name) {
                vm.propertyLabel ? verbose += ' ' + vm.propertyLabel + ': ' : verbose += ' Property: ';
                verbose += filterToApply.property_name + ',';
            }
            if (filterToApply.filter_type) {
                vm.filtersLabel ? verbose += ' ' + vm.filtersLabel + ': ' : verbose += ' Filter to apply: ';
                vm.filterTranslations ?
                    vm.filterTranslations[filterToApply.filter_type] ?
                        verbose += vm.filterTranslations[filterToApply.filter_type]
                        : verbose += filterToApply.filter_type
                    : verbose += filterToApply.filter_type;
                verbose += ',';

            }
            if (filterToApply.value) {
                vm.valueLabel ? verbose += ' ' + vm.valueLabel+': ' : verbose += ' Value: ';
                verbose += filterToApply.value;
            }
            vm.appliedFilters[index].verbose = verbose;
        };

        var generateQuery = function generateQuery(index) {
            var query = '';
            var filterToApply = vm.appliedFilters[index].filter.field;
            if (filterToApply.name) {
                query += filterToApply.name;
            }
            if (filterToApply.property_name) {
                query += '__' + filterToApply.property_name;
            }
            if (filterToApply.filter_type) {
                if (filterToApply.filter_type !== 'equals') {
                    query += '__' + filterToApply.filter_type;
                }
                query += '=';
            }
            if (filterToApply.value) {
                query += filterToApply.value;
            }
            vm.appliedFilters[index].query = query;
        };

    }

})();
