/**
 * Created by franciscojaviercerdamartinez on 7/16/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.massiveCharge')
        .controller('HistoricalController', historicalController);

    function historicalController( $scope, ErrorHandler, $log, $mdDialog, MASSIVE_CHARGE,MassiveLoadProvider,$timeout, PAGINATION) {
        var vm = this;
        vm.massive_loads = {};
        vm.loadingPromise = {};
        vm.selectedKind = '';
        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = PAGINATION.pageSize;
        vm.refreshPaginationButtonsComponent = false;

        //variables server pooling
        var loadTime = 60000, //Load the data every second
            errorCount = 0, //Counter for the server errors
            loadPromise; //Pointer to the promise created by the Angular $timout service


        //Declaración de Funciones como variable  de pool request________________________________________________________
        $scope.$on('$destroy', function() {
            cancelNextLoad();
        });

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
                vm.querySet = MASSIVE_CHARGE.filtertype+vm.tipo+MASSIVE_CHARGE.filter_ordering_by_date;
            }
            else{
                vm.querySet = '';
            }

            if(vm.ended){
                vm.querySet=vm.querySet+MASSIVE_CHARGE.filter_end+MASSIVE_CHARGE.filter_ordering_by_date;

            }
            vm.offset = 0;
            vm.limit =PAGINATION.pageSize;
            vm.tipo = null;
            listMassiveLoads();
        }
        function listMassiveLoads() {
            vm.massive_loads = {};
            vm.loadingPromise = MassiveLoadProvider.getMassiveLoadHistory(vm.limit, vm.offset, vm.querySet)
                .then(function listT(list) {

                    vm.massive_loads =list.results.sort(function(a, b){return b.id-a.id;});
                    vm.objectPaginado = list;
                    vm.refreshPaginationButtonsComponent = true;
                    errorCount = 0;
                    nextLoad();

                })
                .catch(function ListError(error) {
                    $log.error(error);
                    ErrorHandler.errorTranslate(error);
                    nextLoad(++errorCount * 2 * loadTime);
                });
        }

        //Funciones para el pool request
        var cancelNextLoad = function() {
            $timeout.cancel(loadPromise);
        };

        var nextLoad = function(mill) {
            mill = mill || loadTime;

            //Always make sure the last timeout is cleared before starting a new one
            cancelNextLoad();
            loadPromise = $timeout(vm.listMassiveLoads, mill);
        };

        //terminan funciones pool request


        function listMassiveLoadsType() {
            vm.promiseMassiveLoadTypeList = MassiveLoadProvider.getMassiveLoadType()
                .then(function (listType) {
                    vm.massive_charge_kind = listType.results;
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
        }
        //funciones para paginado
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
                    listMassiveLoads();

                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                    listMassiveLoads();
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
