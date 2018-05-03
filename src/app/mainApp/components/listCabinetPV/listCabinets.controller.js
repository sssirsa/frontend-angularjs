//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinetPV/listCabinets.tmpl.html',
            controller: listCabinetController,
            controllerAs: '$ctrl',
            bindings:{
                todosex: '<',
                up: '&',
                todosprev2: '<'
            }
        })
        .filter('cabinetPVFilter', custom);

    /* @ngInject */
    function listCabinetController (cabinetPV, Helper, Translate, toastr, $log, $mdDialog) {
        var vm = this;

        vm.todosprev = vm.todosprev2;
        vm.todos = vm.todosex;
        vm.loadingPromise = null;
        vm.toModel = null;
        vm.searchText = '';

        //functions

        vm.info = info;

        function info(item) {
            //vm.toModel = item.clone();

            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'cabinetPVController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinetPV/modal/modalCabinetPV.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals:{
                    data: vm.toModel
                }
            })
                .then(function () {
                    vm.todosprev = null;
                    vm.todos = [];
                    vm.up();
                })
                .catch(function(){

                });
        }
    }

    function custom() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.economico.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };
    }


})();
