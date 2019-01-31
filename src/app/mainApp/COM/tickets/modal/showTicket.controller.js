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
        vm.chip = [];
        vm.infoChip = null;

        //funciones
        vm.cerrar = cerrar;
        vm.view = view;
        vm.clean =  clean;

        init();

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function init() {
            angular.forEach(vm.infoTicket.message_set, function Menssages(msj) {
                msj.com_code = msj.tipo_com.com_code;
                msj.text = msj.tipo_com.label;
                msj.nombre_com =  msj.tipo_com.nombre_com;
                vm.chip.push(msj);
            });
        }

        function view(info) {
            if(!vm.infoChip){
                vm.infoChip = info;
            }else if(vm.infoChip.identificador == info.identificador){
                vm.infoChip = null;
            }else if(vm.infoChip.identificador != info.identificador){
                vm.infoChip = info;
            }
        }

        function clean() {
            vm.infoChip = null;
        }

    }

})();
