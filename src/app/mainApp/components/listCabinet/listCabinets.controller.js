//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinet/listCabinets.tmpl.html',
            controller: listCabinetController,
            controllerAs: '$ctrl',
            bindings:{
                todosex: '<',
                up: '&',
                todosprev2: '<',
                filterData: '&',
                textSearchFilter: '<'
            }
        });
        //.filter('cabinetPVFilter', custom);

    /* @ngInject */
    function listCabinetController (cabinetUC, Helper, Translate, toastr, $log, $mdDialog, ErrorHandler) {
        var vm = this;

        vm.todosprev = vm.todosprev2;
        vm.todos = vm.todosex;
        vm.loadingPromise = null;
        vm.toModel = null;
        vm.searchText = '';

        //functions

        vm.info = info;
        vm.searchCabinet = searchCabinet;
        vm.impediment = impediment;

        function info(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'cabinetController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/modalCabinet.tmpl.html',
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

        function showinList(data){
            vm.todos = [];
            vm.todos.push(data);
        }

        function prepareData(data) {
            data.marca = data.modelo.marca.nombre;
            data.modelo = data.modelo.nombre;
            data.id_modelo = data.modelo.id;

            if(data.deleted === false){
                data.estado = "Activo";
            }else{
                data.estado = "Inactivo";
            }

            cabinetUC.getCabinetInSubsidiary(data.economico)
                .then(function Subsidiary(control) {
                    if(control.impedimento){
                        data.control = true;
                        data.impedido = true;
                    }else{
                        data.control = true;
                        data.impedido = false;
                    }

                    showinList(data);
                })
                .catch(function SubsidiaryError(error) {
                    data.control = false;
                    data.impedido = false;

                    showinList(data);
                });
        }

        function searchCabinet() {
            cabinetUC.getByID(vm.searchText)
                .then(function (cabinet) {
                    prepareData(cabinet);
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }

        function impediment(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'cabinetPVController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/impediment.tmpl.html',
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


})();
