//Create by Alex 29/04/2018

(function () {
    'use strict';
    angular
        .module('storeManager')
        .controller('credentialStoreController',credentialStoreController);

    function credentialStoreController(Helper, $mdDialog, data)
    {
        var vm = this;

        vm.urlQR = data;

        if(!vm.urlQR){
            vm.urlQR = 'assets/images/errors/errorCredential.png';
        }

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
