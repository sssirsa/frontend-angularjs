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

        init();

        function init() {
            if (vm.filterData !== null) {
                if (vm.textSearchFilter.length > 0) {
                    vm.searchText = vm.textSearchFilter;
                }
            }
        }

        function info(item) {
            //vm.toModel = item.clone();

            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'cabinetPVController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinet/modal/modalCabinetPV.tmpl.html',
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

        function prepareData(data) {
            var ux;

            if(data.deleted === false){
                ux = "Activo";
            }else{
                ux = "Inactivo";
            }

            var aux = {
                economico: data.economico,
                id_unilever: data.id_unilever,
                no_serie: data.no_serie,
                year: data.year,
                condicion: data.condicion.descripcion,
                estatus_com: data.estatus_com.descripcion,
                estatus_unilever: data.estatus_unilever.descripcion,
                marca: data.modelo.marca.descripcion,
                modelo: data.modelo.nombre,
                tipo: data.modelo.tipo.nombre,
                estado: ux,
                qr_code: data.qr_code,
                identifiers:{
                    id_modelo: data.modelo.id,
                    id_marca: data.modelo.marca.id
                },
                deleted: data.deleted
            };

            return aux;
        }

        function searchCabinet() {
            cabinetUC.getByID(vm.searchText)
                .then(function (cabinet) {
                    info(prepareData(cabinet));
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }
    }


})();
