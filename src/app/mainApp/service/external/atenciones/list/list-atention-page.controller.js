(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('listAtentionController', listAtentionController);

    function listAtentionController(SalePoint, OPTIONS, toastr, Translate, $state, $mdDialog) {
        var vm = this;

        vm.selectedKind = null;
        vm.salePoints = null;
        vm.salePointKinds = OPTIONS.salePointAssignKind;
        vm.Atending = Atending;
        vm.Editing = Editing;
        vm.selectRequest = selectRequest;

        // function Assing(salePoint) {
        //     console.log(salePoint);
        //     $mdDialog.show({
        //         controller: 'dialogAsignacionTecnicoController',
        //         templateUrl: 'app/mainApp/service/external/asignacionServicio/Dialog/dialogAsignacionTecnico.tmpl.html',
        //         parent: angular.element(document.body),
        //         controllerAs: 'vm',
        //         clickOutsideToClose: true,
        //         focusOnOpen: true,
        //         locals: {
        //             salePoint: salePoint
        //         }
        //     })
        //         .then(function () {
        //             vm.selectedKind = 'pending';
        //             vm.salePoints = null;
        //             vm.listSalePoints();
        //         });
        //
        // }

        function Atending(salePoint) {
            console.log('ATENDIENDO ATENCION');
            console.log(salePoint);
            console.log('ATENDIENDO ATENCION');
        }

        function Editing(salePoint) {
            console.log('EDITANDO ATENCION');
            console.log(salePoint);
            console.log('EDITANDO ATENCION');
        }

        //Function mapping
        vm.listSalePoints = listSalePoints;
        vm.selectSalePoint = selectSalePoint;

        function listSalePoints() {
            if (vm.selectedKind) {
                vm.salePoints = null;
                switch (vm.selectedKind) {
                    case 'pending':
                        vm.loadingPromise = SalePoint.listUnasignedServices()
                            .then(function (salePointsSuccess) {
                                vm.salePoints = salePointsSuccess;
                                console.log(vm.salePoints);
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
                                    console.log(vm.salePoints);

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

        function selectRequest(request) {
            $state.go('triangular.admin-default.attentionDetail', {id: request});
            console.log("Folio: ", request);
        }

    }

})();
