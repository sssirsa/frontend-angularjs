(function () {
    'use strict';

    angular
        .module('app.mainApp.tecnico')
        .controller('asignacionServicioController', asignacionServicioController);

    function asignacionServicioController(SalePoint, OPTIONS, toastr, Translate, $state) {
        var vm = this;

        vm.selectedKind = null;
        vm.salePoints = null;
        vm.salePointKinds = OPTIONS.salePointAssignKind;

        //Function mapping
        vm.listSalePoints = listSalePoints;
        vm.selectSalePoint = selectSalePoint;

        function listSalePoints() {
            if (vm.selectedKind) {
                switch (vm.selectedKind) {
                    case 'pending':
                        vm.loadingPromise = SalePoint.listUnasignedServices()
                            .then(function (salePointsSuccess) {
                                vm.salePoints = salePointsSuccess;
                            })
                            .catch(function (salePointsError) {
                                console.log(salePointsError);
                                toastr.error(
                                    Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                    Translate.translate('MAIN.MSG.ERROR_TITLE')
                                );
                            });
                        break;
                    case 'attended':
                        vm.loadingPromise = SalePoint.listAttendedServices()
                            .then(function (salePointsSuccess) {
                                if (salePointsSuccess.length > 0) {
                                    vm.salePoints = salePointsSuccess;
                                }
                                else {
                                    vm.salePoints = null;
                                }
                            })
                            .catch(function (salePointsError) {
                                console.log(salePointsError);
                                vm.salePoints = null;
                                toastr.error(
                                    Translate.translate('MAIN.MSG.SUCCESS_TITLE'),
                                    Translate.translate('MAIN.MSG.ERROR_MESSAGE')
                                );
                            });
                        break;
                }
            }
        }

        function selectSalePoint(salePoint) {
            $state.go('triangular.admin-default.serviceAssignDetail', {id: salePoint.folio, tipo: vm.selectedKind});
        }

    }

})();
