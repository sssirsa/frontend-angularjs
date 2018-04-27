//Create by Alex 26/04/2018

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('newCabinetPreController',newCabinetPreController);

    function newCabinetPreController(Helper,$mdDialog)
    {
        var vm = this;

        vm.cerrar = cerrar;
        vm.submit = submit;


        function submit()
        {
            $mdDialog.hide();
        }

        function cerrar() {
            $mdDialog.cancel(null);
        }


        vm.imagePath = "https://sssirsa-mobile-dev-documents.s3.amazonaws.com:443/qr_codes/cabinet/908070709.png?Signature=OW77h2mH%2F9mnwRCtuuLlR%2F2bKTY%3D&Expires=1524808388&AWSAccessKeyId=AKIAIITVBJH7HAF5W5XA";
    }

})();
