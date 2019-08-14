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

            if (vm.cabinet.estatus_unilever === '0008') {
                var aux = {
                    economico: vm.cabinet.economico,
                    id_unilever: vm.cabinet.id_unilever,
                    no_serie: vm.cabinet.no_serie,
                    year: vm.cabinet.year,
                    categoria_id: vm.cabinet.categoria,
                    modelo_id: vm.cabinet.id_modelo,
                    pedimento_id: vm.cabinet.pedimento,
                    estatus_unilever_id: 4
                };

                console.log(vm.cabinet);
                console.log(aux);

                cabinetUC.update(data.economico, vm.cabinet)
                    .then(function (res) {
                        toastr.success(vm.update);
                        $mdDialog.hide(res);
                    })
                    .catch(function (err) {
                        toastr.error(ErrorHandler.errorTranslate(err));
                        $mdDialog.hide(err);
                    });

            } else {
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
