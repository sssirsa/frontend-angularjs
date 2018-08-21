(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('listAtentionController', listAtentionController);

    function listAtentionController(SalePoint, OPTIONS, toastr, Translate, $state, $mdDialog, atencionPV, ErrorHandler, AttentionReportBuilder, $log, $stateParams) {
        var vm = this;

        vm.selectedKind = null;
        vm.salePoints = null;
        vm.salePointKinds = OPTIONS.salePointAssignKind;
        vm.aceptButton = Translate.translate('MAIN.BUTTONS.ACCEPT');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
        vm.dialogRestoreTitle = Translate.translate('MAIN.DIALOG.CANCEL_ATTENTION_TITLE');
        vm.dialogRestoreMessage = Translate.translate('MAIN.DIALOG.CANCEL_ATTENTION_MESSAGE');
        vm.Atending = Atending;
        vm.Editing = Editing;
        vm.Cancel = Cancel;
        vm.selectRequest = selectRequest;
        vm.Report = Report;

        function Report(salepoint) {
            console.log(salepoint)
            AttentionReportBuilder.buildReport(salepoint.folio);


        }

        init();

        function init() {
            if ($stateParams.runListPendientes !== null) {
                vm.selectedKind = 'pending';
                changeSelected();
            }
            else {
                if ($stateParams.runListTodos !== null) {
                    vm.selectedKind = 'all';
                    changeSelected();
                }
            }
        }

        function Editing(salePoint) {
            // console.log(salePoint);
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
            // console.log(salePoint);
            selectRequest(salePoint.folio);
        }

        function Cancel(salePoint) {
            var aux = {cancelacion: true, km: '0'};

            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar')
                .ok(vm.aceptButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                // console.log(salePoint, aux);
                atencionPV.putActualiza(salePoint.folio, aux)
                    .then(function (result) {
                        toastr.success('La atención se canceló correctamente');
                        listSalePoints();
                    })
                    .catch(function (resultError) {
                        ErrorHandler.errortranslate(resultError);
                    });
            }, function () {

            });
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
                        vm.loadingPromise = SalePoint.listAsignedService('20', vm.offset)
                            .then(function (salePointsSuccess) {
                                vm.objectAtention = salePointsSuccess;
                                prepareDataFunction();
                                // console.log(salePointsSuccess);
                            })
                            .catch(function (salePointsError) {
                                // console.log(salePointsError);
                                toastr.error(
                                    Translate.translate('MAIN.MSG.ERROR_MESSAGE'),
                                    Translate.translate('MAIN.MSG.ERROR_TITLE')
                                );
                            });
                        break;
                    case 'all':
                        vm.loadingPromise = SalePoint.listAllServices('20', vm.offset)
                            .then(function (salePointsSuccess) {
                                vm.objectAtention = salePointsSuccess;
                                prepareDataFunction();
                                // console.log(salePointsSuccess);
                            })
                            .catch(function (salePointsError) {
                                // console.log(salePointsError);
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
            // console.log(vm.salePoints);
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
            $state.go('triangular.admin-default.attentionDetail', {id: request, tipo: vm.selectedKind});
        }

    }

})();
