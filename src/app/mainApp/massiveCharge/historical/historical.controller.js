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

        //Funciones Propias de la Pantalla
        init();

        function init() {
            listMassiveLoads();
            listMassiveLoadsType();
        }

        function listAll() {
            vm.querySet = '';
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



        //  Funciones para Componentes _________________________________________________________________________________

        //--------------------------------------------------------------------------------------------------------------


    }


})();
