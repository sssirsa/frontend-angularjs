//Create by Alex 26/04/2018

(function () {
    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinet/listCabinets.tmpl.html',
            controller: listCabinetController,
            controllerAs: '$ctrl',
            bindings: {
                todosex: '<',
                up: '&',
                todosprev2: '<',
                textSearchFilter: '&'
            }
        });

    /* @ngInject */
    function listCabinetController(
        cabinetUC,
        Helper,
        Translate,
        toastr,
        $log,
        $mdDialog,
        ErrorHandler
    ) {
        var vm = this;

        vm.todosprev = vm.todosprev2;
        vm.todos = vm.todosex;
        vm.loadingPromise = null;
        vm.toModel = null;
        vm.searchText = '';
        vm.searchBool = false;

        //functions

        vm.info = info;
        vm.searchCabinet = searchCabinet;
        vm.impediment = impediment;
        vm.removeFilter = removeFilter;
        vm.showImpediment = showImpediment;


        function info(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'CabinetController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/modalCabinet.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    data: vm.toModel
                }
            })
                .then(function () {
                    vm.todosprev = null;
                    vm.todos = [];
                    vm.up();
                })
                .catch(function () {

                });
        }

        function showinList(data) {
            vm.todos = [];
            vm.todos.push(data);
        }

        function prepareData(data) {
            data.marca = data.modelo.marca.nombre;
            data.id_modelo = data.modelo.id;
            data.modelo = data.modelo.nombre;

            if (data.deleted === false) {
                data.estado = "Activo";
            } else {
                data.estado = "Inactivo";
            }

            cabinetUC.getCabinetInSubsidiary(data.economico)
                .then(function Subsidiary(control) {
                    if (control.impedimento) {
                        data.control = true;
                        data.impedido = true;
                        data.impedimento_id = control.impedimento;
                    } else {
                        data.control = true;
                        data.impedido = false;
                    }

                    showinList(data);
                })
                .catch(function SubsidiaryError() {
                    data.control = false;
                    data.impedido = false;

                    showinList(data);
                });
        }

        function searchCabinet() {
            vm.textSearchFilter();
            cabinetUC.getByID(vm.searchText)
                .then(function (cabinet) {
                    prepareData(cabinet);
                    vm.searchBool = true;
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }

        function impediment(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'modalImpedimentController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/impediment.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    data: vm.toModel
                }
            })
                .then(function () {
                    vm.todosprev = null;
                    vm.todos = [];
                    vm.up();
                })
                .catch(function () {

                });
        }

        function showImpediment(id) {
            $mdDialog.show({
                controller: 'impedimentDetailController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/impedimentDetail.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    data: id
                }
            })
                .then(function () {
                })
                .catch(function () {
                });
        }

        function removeFilter() {
            vm.searchBool = false;
            vm.todosprev = null;
            vm.todos = [];
            vm.up();
            vm.textSearchFilter();
        }


    }


})();
