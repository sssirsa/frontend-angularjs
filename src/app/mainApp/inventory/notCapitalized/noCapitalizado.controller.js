/**
 * Created by Alejandro Noriega Montalban on 12/12/18.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory')
        .controller('noCapitalizadoController', noCapitalizadoController);

    function noCapitalizadoController($mdDialog, Translate, toastr, ErrorHandler, noLabeled, Helper) {
        //Variable definition
        var vm = this;
        vm.todos = [];
        vm.loadingPromise = null;

        vm.aRefresh = aRefresh;
        vm.listNoLabeled = listNoLabeled;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.filterList = filterList;
        vm.crearNoCapitalizado = crearNoCapitalizado;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.textToSearch = '';
        vm.preTextToSearch = '';
        vm.querySet = 'economico__contains=';

        function aRefresh() {
            vm.todos = [];
            vm.objectPaginado = null;
            vm.offset = 0;
            listNoLabeled();
        }

        function paginadoRefresh() {
            vm.todos = [];
            listNoLabeled();
        }

        listNoLabeled();

        function listNoLabeled(){
            vm.refreshPaginationButtonsComponent = false;
            if (vm.preTextToSearch !== vm.textToSearch) {
                vm.offset = 0;
                vm.preTextToSearch = vm.textToSearch;
            }
            if (vm.textToSearch.length === 0) {
                vm.loadingPromise = noLabeled.list(vm.limit, vm.offset)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {
                        console.debug(err);
                        toastr.error("No se pudo cargar los elementos");
                    });
            }
            else {
                var sendQuery = vm.querySet + vm.textToSearch;
                vm.loadingPromise = noLabeled.list(vm.limit, vm.offset, sendQuery)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {
                        toastr.error(err);
                    });
            }

        }


        function prepareDataFunction() {
            vm.todos = Helper.filterDeleted(vm.objectPaginado.results, true);
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
            vm.textToSearch = '' + economicFilter;
            paginadoRefresh();
        }

        //modales

        function crearNoCapitalizado() {
            $mdDialog.show({
                controller: 'notCapitalizedDialogController',
                templateUrl: 'app/mainApp/inventory/notCapitalized/dialog/dialogCreateNotCapitalized.tmpl.html',
                controllerAs: 'vm',
                fullscreen: true,
                clickOutsideToClose: true
            }).then(function (respuesta) {
                console.log(respuesta);
                ErrorHandler.successCreation();
                vm.cabinetCreated = respuesta;
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errorTranslate(err);
                }
            });
        }

    }

})();
