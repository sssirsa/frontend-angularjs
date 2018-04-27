//Create by Alex 26/04/2018

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('newCabinetPreController',newCabinetPreController);

    function newCabinetPreController(Helper, $mdDialog, data)
    {
        var vm = this;

        vm.info = data;
        vm.urlQR = vm.info.qr_code;

        vm.cerrar = cerrar;
        vm.submit = submit;


        function submit()
        {
            $mdDialog.hide();
        }

        function cerrar() {
            $mdDialog.cancel(null);
        }

    }

})();
