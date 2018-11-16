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
        vm.showNoCapitalizado = showNoCapitalizado;
        vm.changeSelected = changeSelected;
        vm.searchCabinet = searchCabinet;


        //variables
        vm.Kinds = [{nombre: 'Identificador',
                    value:1},
                    {nombre: 'Número de serie',
                    value:2}];

        vm.selectedKind = null;
        vm.querySet = '';
        vm.searchText = '';

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;

        function changeSelected(){
            if(vm.selectedKind == 2){
                aRefresh();
            }
        }

        function searchCabinet(){
            if(!vm.selectedKind){
                toastr.error("Selecione un tipo de búsqueda");
            }else{
                if(vm.selectedKind == 2){
                    vm.querySet = 'no_serie__icontains=' + vm.searchText;
                    listNoLabeled();
                }else{
                    vm.loadingPromise = noLabeled.getByID(vm.searchText)
                        .then(function (no_cap) {
                            if(!no_cap.status){
                                no_cap.status = "Sin asignar";
                            }else{
                                no_cap.status = no_cap.status.nombre;
                            }
                            showNoCapitalizado(no_cap);
                            vm.searchText = '';
                        })
                        .catch(function (err) {
                            ErrorHandler.errorTranslate(err);
                        });
                }
            }
        }

        function aRefresh() {
            vm.todos = [];
            vm.objectPaginado = null;
            vm.offset = 0;
            vm.searchText = '';
            vm.querySet = '';
            listNoLabeled();
        }

        function paginadoRefresh() {
            vm.todos = [];
            listNoLabeled();
        }

        listNoLabeled();

        function listNoLabeled(){
            vm.refreshPaginationButtonsComponent = false;

            if(vm.searchText){
                vm.loadingPromise = noLabeled.list(vm.limit, vm.offset, vm.querySet.toString())
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {
                        console.debug(err);
                        toastr.error("Error al cargar los elementos");
                    });
            }else{
                vm.loadingPromise = noLabeled.list(vm.limit, vm.offset)
                    .then(function (res) {
                        vm.objectPaginado = res;
                        prepareDataFunction();
                        vm.refreshPaginationButtonsComponent = true;
                    })
                    .catch(function (err) {
                        console.debug(err);
                        toastr.error("Error al cargar los elementos");
                    });
            }
        }


        function prepareDataFunction() {
            vm.todos = Helper.filterDeleted(vm.objectPaginado.results, true);
            angular.forEach(Helper.filterDeleted(vm.objectPaginado.results, true), function (data) {
                if(data.deleted === true){
                    data.activo = "Desactivado";
                }else{
                    data.activo = "Activo";
                }

                if(!data.status){
                    data.status = "Sin asignar";
                }else{
                    data.status = data.status.nombre;
                }
            });
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

        function transformChip(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
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
                aRefresh();
            }).catch(function (err) {
            });
        }


        function showNoCapitalizado(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'notCapitalizedUpdateDialogController',
                templateUrl: 'app/mainApp/inventory/notCapitalized/dialog/dialogUpdateNotCapitalized.tmpl.html',
                controllerAs: 'vm',
                fullscreen: true,
                locals:{
                    data: vm.toModel
                },
                clickOutsideToClose: true
            }).then(function (respuesta) {
                ErrorHandler.successCreation();
                aRefresh();
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errorTranslate(err);
                }
            });
        }

    }

})();