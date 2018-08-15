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
        vm.Cancel = Cancel;
        vm.selectRequest = selectRequest;


        function Editing(salePoint) {
            console.log(salePoint);
            $mdDialog.show({
                controller: 'dialogReasignacionTecnicoController',
                templateUrl: 'app/mainApp/service/external/atenciones/Dialog/dialogReasignacionTecnico.tmpl.html',
                parent: angular.element(document.body),
                controllerAs: 'vm',
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    salePoint: salePoint
                }
            })
                .then(function () {
                    listSalePoints();
                });

        }


        function Atending(salePoint) {
            console.log(salePoint);
            selectRequest(salePoint.folio);
        }

        function Cancel(salePoint) {
            console.log('CANCELANDO ATENCION');
            console.log(salePoint);
            console.log('CANCELANDO ATENCION');
        }


        //Function mapping
        vm.listSalePoints = listSalePoints;

        //datos para paginado
        vm.objectAtention = null;
        vm.offset = 0;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.changeSelected = changeSelected;

        function changeSelected() {
            vm.offset = 0;
            listSalePoints();
        }

        function listSalePoints() {
            if (vm.selectedKind) {
                vm.objectAtention = null;
                switch (vm.selectedKind) {
                    case 'pending':
                        vm.loadingPromise = SalePoint.listAsignedService('20',vm.offset)
                            .then(function (salePointsSuccess) {
                                vm.objectAtention = salePointsSuccess;
                                prepareDataFunction();
                                console.log(salePointsSuccess);
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
                        vm.loadingPromise = SalePoint.listAttendedServices('?limit=20&offset='+vm.offset)
                            .then(function (salePointsSuccess) {
                                vm.objectAtention = salePointsSuccess;
                                prepareDataFunction();
                                console.log(salePointsSuccess);
                            })
                            .catch(function (salePointsError) {
                                console.log(salePointsError);
                                toastr.error(
                                    Translate.translate('MAIN.MSG.SUCCESS_TITLE'),
                                    Translate.translate('MAIN.MSG.ERROR_MESSAGE')
                                );
                            });
                        break;
                }
            }
        }

        function prepareDataFunction() {
            vm.salePoints = vm.objectAtention.results;
        }

        function sigPage() {
            vm.offset += 20;
            listSalePoints();
        }

        function prevPage() {
            vm.offset -= 20;
            listSalePoints();
        }

        function selectRequest(request) {
            $state.go('triangular.admin-default.attentionDetail', {id: request, tipo: vm.selectedKind });
        }

    }

})();
