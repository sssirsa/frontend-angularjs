(function () {
    angular
        .module('app.mainApp.reports')
        .component('filterSelectors', {
            templateUrl: 'app/mainApp/reports/filter-selects/filter-selects.tmpl.html',
            controller: filterSelectsController,
            controllerAs: 'vm',
            bindings: {
                filters: '<',
                querie: '=',
                results: '=',
                fieldLabel: '<',
                propertyLabel: '<',
                cleanModels: '<'
            }
        });

    function filterSelectsController() {
        var vm = this;

        vm.filterControl = [];
        vm.propertiesControl = [];
        vm.modelFilters = [];
        vm.modelProperties = [];


        var init = function () {
            vm.filterControl.push(vm.filters);
        };
        init();

        vm.changeSelector = function changeSelector(idx, element) {
            vm.filterControl = vm.filterControl.slice(0,idx+1);
            vm.propertiesControl = [];
            vm.querie = null;
            vm.cleanModels();
            var newFilter = vm.filterControl[idx][element];
            if (Object.keys(newFilter).length === 0) {
                vm.querie = ['equals'];
                vm.getResultStringQuery();
            }
            else {
                if (newFilter.hasOwnProperty('filter')) {
                    if (!angular.isArray(newFilter.filter)){
                        vm.propertiesControl.push(newFilter.filter);
                    }
                    else {
                        vm.querie = ['equals'];
                        vm.querie = vm.querie.concat(newFilter.filter);
                        vm.getResultStringQuery();
                    }
                }
                else {
                    vm.filterControl.push(newFilter);
                }
            }
        };

        vm.changeSelectorProp = function changeSelectorProp(idx, element) {
            vm.querie = ['equals'];
            vm.querie = vm.querie.concat(vm.propertiesControl[idx][element]);
            vm.getResultStringQuery();
        };

        vm.getResultStringQuery = function getResultStringQuery() {
            var string  = '';
            angular.forEach(vm.modelFilters, function (value) {
                string += value + '__';
            });
            angular.forEach(vm.modelProperties, function (value) {
                string += value + '__';
            });
            vm.results = string;
        };
    }
})();
