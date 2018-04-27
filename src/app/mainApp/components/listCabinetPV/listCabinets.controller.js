//Create by Alex 26/04/2018

(function () {

    angular
        .module('app.mainApp')
        .component('listCabinet', {
            templateUrl: 'app/mainApp/components/listCabinetPV/listCabinets.tmpl.html',
            controller: listCabinetController
        })
        .filter('cabinetPVFilter', custom);

    /* @ngInject */
    function listCabinetController (cabinetPV, Helper, Translate, toastr, $log, $mdDialog) {
        var vm = this;

        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;


        //functions
        vm.listcabinets = listcabinets;
        vm.info = info;

        listcabinets();

        function listcabinets(){
            var ux = "Activo";

            vm.loadingPromise = cabinetPV.list()
                .then(function (res) {
                    vm.todosprev = Helper.filterDeleted(res, true);

                    angular.forEach(vm.todosprev, function (cabinet) {

                        if(cabinet.activo === true){
                            ux = "Activo";
                        }else{
                            ux = "Inactivo";
                        }

                        var cabinetPreview = {
                            economico: cabinet.economico,
                            modelo: {
                                id: cabinet.modelo.id,
                                deleted: cabinet.modelo.deleted,
                                nombre: cabinet.modelo.nombre,
                                descripcion: cabinet.modelo.descripcion,
                                palabra_clave: cabinet.modelo.palabra_clave,
                                tipo: cabinet.modelo.tipo,
                                marca: cabinet.modelo.marca
                            },
                            modelo_id: cabinet.modelo_id,
                            antiguedad: cabinet.antiguedad,
                            activo: cabinet.activo,
                            estado: ux,
                            no_incidencias: cabinet.no_incidencias,
                            qr_code: cabinet.qr_code,
                            deleted: cabinet.deleted,
                            no_serie: cabinet.no_serie
                        };

                        vm.todos.push(cabinetPreview);

                    });

                })
                .catch(function (err) {

                });
        }

        function info(item) {
            $mdDialog.show({
                controller: 'cabinetPVController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/listCabinetPV/modal/modalCabinetPV.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals:{
                    data: item
                }
            })
                .then(function () {
                    vm.todosprev = null;
                    vm.todos = [];
                    listcabinets();
                })
                .catch(function(){

                });
        }



        vm.searchText = '';
        vm.search_items = [];


        vm.lookup = lookup;
        vm.selectedItemChange = selectedItemChange;
        vm.querySearch = querySearch;

        function querySearch(query) {
            var results = query ? lookup(query) : vm.lineas;
            return results;

        }

        function lookup(search_text) {
            vm.search_items = _.filter(vm.todos, function (item) {
                return item.economico.indexOf(search_text) >= 0;
            });
            return vm.search_items;
        }

        function selectedItemChange(item)
        {
            info(item);
        }

    }

    function custom() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.economico.indexOf(text) >= 0;
            });

        };
    }

})();
