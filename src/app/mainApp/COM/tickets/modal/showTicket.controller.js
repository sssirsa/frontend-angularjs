//Create by Alex 30/01/2019

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('detailTicketController',detailTicketController);

    function detailTicketController($mdDialog, data, Translate, ErrorHandler)
    {
        var vm = this;

        //variables
        vm.infoTicket = data;

        //funciones
        vm.cerrar = cerrar;

        init();

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function init() {
            console.log(vm.infoTicket);
        }

    }

})();
