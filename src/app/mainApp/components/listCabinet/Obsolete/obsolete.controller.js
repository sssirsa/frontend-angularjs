//Create by Alex 25/01/2019

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('modalObsoleteController',modalObsoleteController);

    function modalObsoleteController(
        cabinetUC,
        $mdDialog,
        data,
        $scope,
        toastr,
        Translate,
        URLS,
        ErrorHandler,
        EnvironmentConfig,
        PAGINATION
    )
    {
        var vm = this;

        //variables
        vm.cabinet = data;
        console.log(vm.cabinet)
        vm.service = true;

        vm.loadingPromise = null;
        vm.confirmation = false;
        vm.validate = true;

        //funciones
        vm.cerrar = cerrar;
        vm.toObsolete = toObsolete;
        vm.acceptConfirm = acceptConfirm;
        vm.cancelConfirm = cancelConfirm;

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function toObsolete() {
            vm.confirmation = true;
        }

        function acceptConfirm() {
            console.log(vm.economico);
            $mdDialog.hide();

            /*cabinetUC.notDepartures(vm.cabinet)
                .then(function (res) {
                    toastr.success(vm.successImpediment, vm.successTitle);
                    $mdDialog.hide(res);
                })
                .catch(function (err) {
                    ErrorHandler.errorTranslate(err);
                    $mdDialog.hide(err);
                });*/
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }


    }

})();
