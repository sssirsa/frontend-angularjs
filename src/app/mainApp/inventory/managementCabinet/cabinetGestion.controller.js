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
            angular.forEach(vm.todosprev, function (cabinet) {
                cabinet.marca = cabinet.modelo.marca.nombre;
                cabinet.modelo = cabinet.modelo.nombre;
                cabinet.id_modelo = cabinet.modelo.id;

                if(cabinet.deleted === false){
                    cabinet.estado = "Activo";
                }else{
                    cabinet.estado = "Inactivo";
                }

                cabinetUC.getCabinetInSubsidiary(cabinet.economico)
                    .then(function Subsidiary(control) {
                        if(control.impedimento){
                            cabinet.control = true;
                            cabinet.impedido = true;
                        }else{
                            cabinet.control = true;
                            cabinet.impedido = false;
                        }

                        vm.todos.push(cabinet);
                    })
                    .catch(function SubsidiaryError(error) {
                        cabinet.control = false;
                        cabinet.impedido = false;
                        vm.todos.push(cabinet);
                    });
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
