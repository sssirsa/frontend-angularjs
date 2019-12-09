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
        ErrorHandler
    )
    {
        var vm = this;

        //variables
        vm.cabinet = data;
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
            if (vm.cabinet.estatus_unilever !== 4) {
                vm.economico = {cabinet_id: data.economico};

                cabinetUC.obsolete(vm.economico)
                    .then(function (res) {
                        toastr.success();
                        $mdDialog.hide(res);
                    })
                    .catch(function (err) {
                        ErrorHandler.errorTranslate(err);
                        $mdDialog.hide(err);
                    });
            }
        }

        function cancelConfirm() {
            $mdDialog.cancel(null);
        }


    }

})();
