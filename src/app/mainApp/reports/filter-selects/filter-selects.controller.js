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
                fieldLabel: '<',
                propertyLabel: '<'
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
            console.log(idx, element);
            var newFilter = vm.filterControl[idx][element];
            console.log(newFilter);
            if (Object.keys(newFilter).length === 0) {
                console.log('Fin de la query, mandar query y valores');
            }
            else {
                if (newFilter.hasOwnProperty('filter')) {
                    console.log('seleccion de propiedades');
                    vm.propertiesControl.push(newFilter.filter);
                }
                else {
                    console.log('faltan mas datos');
                    vm.filterControl.push(newFilter);
                }
            }
        };

        vm.changeSelectorProp = function changeSelectorProp(idx, element) {
            console.log(idx, element);
            console.log(vm.propertiesControl[idx][element]);
        };
    }
})();
