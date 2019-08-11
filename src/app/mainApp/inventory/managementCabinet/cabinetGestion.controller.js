/**
 * Created by Alex on 19/10/2016.
 */

(function () {
    angular
        .module('app.mainApp.inventory')
        .controller('cabinetGestionController', cabinetGestionController);

    function cabinetGestionController(URLS, cabinetUC, $mdEditDialog, $mdDialog, Helper, ErrorHandler)
    {
        var vm = this;
        vm.todosprev = null;
        vm.todos = [];
        vm.loadingPromise = null;
        vm.textToSearch = '';
        vm.search = false;

        vm.aRefresh = aRefresh;
        vm.listcabinets = listcabinets;
        vm.setPagination = setPagination;vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;

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

        function setPagination(){
            if(vm.search == false){
                vm.search = true;
            }else{
                vm.search = false;
            }
        }

        listcabinets();

        function listcabinets(){
            vm.refreshPaginationButtonsComponent = false;
            vm.loadingPromise = cabinetUC.list(vm.limit, vm.offset)
                .then(function (res) {
                    vm.objectPaginado = res;
                    prepareDataFunction();
                    vm.refreshPaginationButtonsComponent = true;
                })
                .catch(function (err) {
                    ErrorHandler.errorTranslate(err);
                });

        }

        function prepareFinalObjects() {
            angular.forEach(vm.todosprev, function (cabinet) {
                cabinet.marca = cabinet.modelo.marca.nombre;
                cabinet.id_modelo = cabinet.modelo.id;
                cabinet.modelo = cabinet.modelo.nombre;

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
                            cabinet.impedimento_id = control.impedimento;
                        }else{
                            cabinet.control = true;
                            cabinet.impedido = false;
                        }

                        vm.todos.push(cabinet);
                    })
                    .catch(function SubsidiaryError() {
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
    }

})();
