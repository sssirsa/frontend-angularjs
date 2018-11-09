/**
 * Created by Alex on 19/10/2016.
 */

(function () {
    angular
        .module('app.mainApp.inventory')
        .controller('cabinetGestionController', cabinetGestionController);

    function cabinetGestionController(URLS, cabinetUC, $mdEditDialog, $mdDialog, Helper, ErrorHandler, toastr, Translate)
    {
        var vm = this;
        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;

        vm.aRefresh = aRefresh;
        vm.listcabinets = listcabinets;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.textToSearch = '';
        vm.preTextToSearch = '';
        vm.querySet = 'economico__contains=';
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.filterList = filterList;

        function aRefresh() {
            vm.todosprev = null;
            vm.todos = [];
            vm.objectPaginado = null;
            vm.offset = 0;
            listcabinets();
        }

        function paginadoRefresh() {
            vm.todosprev = null;
            vm.todos = [];
            listcabinets();
        }

        listcabinets();

        function listcabinets(){
            vm.refreshPaginationButtonsComponent = false;
            if (vm.preTextToSearch !== vm.textToSearch) {
                vm.offset = 0;
                vm.preTextToSearch = vm.textToSearch;
            }
            if (vm.textToSearch.length === 0) {
                vm.loadingPromise = cabinetUC.list(vm.limit, vm.offset)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {
                        toastr.error(Translate.translate('MAIN.MSG.ERROR_MESSAGE'));
                    });
            }
            else {
                var sendQuery = vm.querySet + vm.textToSearch;
                vm.loadingPromise = cabinetUC.list(vm.limit, vm.offset, sendQuery)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        prepareFinalObjects();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {

                    });
            }

        }

        function prepareFinalObjects() {
            var ux = "Activo";
            angular.forEach(vm.todosprev, function (cabinet) {

                if(cabinet.deleted === false){
                    ux = "Activo";
                }else{
                    ux = "Inactivo";
                }

                var cabinetPreview = {
                    economico: cabinet.economico,
                    id_unilever: cabinet.id_unilever,
                    no_serie: cabinet.no_serie,
                    year: cabinet.year,
                    condicion: cabinet.condicion,
                    categoria: cabinet.categoria,
                    estatus_com: cabinet.estatus_com,
                    estatus_unilever: cabinet.estatus_unilever,
                    marca: cabinet.modelo.marca.descripcion,
                    modelo: cabinet.modelo.nombre,
                    tipo: cabinet.modelo.tipo.nombre,
                    estado: ux,
                    qr_code: cabinet.qr_code,
                    id_modelo: cabinet.modelo.id,
                    deleted: cabinet.deleted
                };

                vm.todos.push(cabinetPreview);
            });
        }

        function prepareDataFunction() {
            vm.todosprev = Helper.filterDeleted(vm.objectPaginado.results, true);
            prepareFinalObjects();
        }

        function sigPage() {
            vm.offset += vm.limit;
            paginadoRefresh();
        }

        function prevPage() {
            vm.offset -= vm.limit;
            paginadoRefresh();
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            paginadoRefresh();
        }

        function filterList(economicFilter) {
            vm.textToSearch = ''+economicFilter;
            paginadoRefresh();
        }
    }

})();
