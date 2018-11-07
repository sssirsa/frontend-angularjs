/**
 * Created by Alejandro Noriega Montalban on 12/12/18.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory')
        .controller('noCapitalizadoController', noCapitalizadoController);

    function noCapitalizadoController($mdDialog, Translate, toastr, ErrorHandler) {
        //Variable definition
        var vm = this;

        //datos para paginado
        vm.objectAtention = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;

        //funciones
        vm.selectCabinet = selectCabinet;
        vm.crearNoCapitalizado = crearNoCapitalizado;

        vm.todos = [];

        vm.todos = [{
            no_serie: "00010101",
            fecha_separacion: "15 Oct 2018",
            fecha_liberacion: "null",
            economico: "10230, 132412",
            entrada: "1",
            salida: "null",
            status: "Bien",
            posicionamiento: "2"
        },
        {
            no_serie: "10000101",
            fecha_separacion: "13 Oct 2018",
            fecha_liberacion: "null",
            economico: "1897149283",
            entrada: "2",
            salida: "null",
            status: "Mal",
            posicionamiento: "1"
        }];


        function prepareDataFunction() {
            //vm.salePoints = vm.objectAtention.results;
            //vm.refreshPaginationButtonsComponent = true;
        }

        function sigPage() {
            vm.offset += vm.limit;
            //listSalePoints();
        }

        function prevPage() {
            vm.offset -= vm.limit;
            //listSalePoints();
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            //listSalePoints();
        }

        function selectCabinet(salePoint) {

        }

        initial();

        function initial(){
            //listSalePoints();
            console.log("hola");
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
