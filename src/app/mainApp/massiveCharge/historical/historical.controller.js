/**
 * Created by franciscojaviercerdamartinez on 7/16/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.massiveCharge')
        .controller('HistoricalController', historicalController);

    function historicalController($scope, Translate, toastr, ErrorHandler, $log, $mdDialog, EnvironmentConfig, URLS, MASSIVE_CHARGE, PAGINATION,MassiveLoadProvider) {
        var vm = this;
        vm.massive_loads = {};
        vm.porcentaje=40;
        vm.loadingPromise = {};
        vm.selectedKind = '';
        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.objectPaginado = null;


        //Declaración de Funciones como variable  de Componentes________________________________________________________


        //--------------------------------------------------------------------------------------------------------------

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.listMassiveLoads = listMassiveLoads;
        vm.listAll = listAll;
        vm.removeFilter=removeFilter;
        vm.cancel=cancel;
        vm.openDialog=openDialog;

        //Funciones Propias de la Pantalla
        init();

        function init() {
            listMassiveLoads();
            listMassiveLoadsType();
        }

        function listAll() {
            if(vm.tipo) {
                vm.querySet = MASSIVE_CHARGE.filtertype+vm.tipo;
            }
            else{
                vm.querySet = '';
            }

            if(vm.ended){
                vm.querySet=vm.querySet+MASSIVE_CHARGE.filter_end;

            }
            vm.offset = 0;
            vm.limit = 20;
            vm.tipo = undefined;
            listMassiveLoads();
        }
        function listMassiveLoads() {
            vm.massive_loads = {};
            vm.loadingPromise = MassiveLoadProvider.getMassiveLoadHistory(vm.limit, vm.offset, vm.querySet)
                .then(function listT(list) {
                    vm.massive_loads = list.results;
                    vm.objectPaginado = list;
                    vm.refreshPaginationButtonsComponent = true;
                })
                .catch(function ListError(error) {
                    $log.error(error);
                    ErrorHandler.errorTranslate(error);
                });
        }


        function listMassiveLoadsType() {
            vm.promiseMassiveLoadTypeList = MassiveLoadProvider.getMassiveLoadType()
                .then(function (listType) {
                    vm.massive_charge_kind = listType.results;
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
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

        function paginadoRefresh() {
            vm.tickets = {};
            vm.objectPaginado = null;
            listMassiveLoads();
        }

        function removeFilter() {
            vm.searchBool = false;
            vm.querySet = '';
            vm.tickets = null;
            vm.selectedKind = '';
            vm.searchText = '';
            listMassiveLoads();
        }
        function cancel(item) {
            vm.promiseCancelMassiveLoad = MassiveLoadProvider.cancelMassiveLoad(item.id)
                .then(function () {
                    ErrorHandler.successCancel();
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
        }
        function openDialog() {
            $mdDialog.show({
                controller: 'createMassiveLoadController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/massiveCharge/modal/create_massive_load.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                }
            }).then(function () {
                ErrorHandler.successCreate();
                listMassiveLoads();

            }).catch(function (errorDelete) {
                if (errorDelete) {
                    ErrorHandler.errorTranslate(errorDelete);
                }
                listMassiveLoads();
            });
        }

        //  Funciones para Componentes _________________________________________________________________________________

        //--------------------------------------------------------------------------------------------------------------


    }


})();
