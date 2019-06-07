/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('GeneralStageController', GeneralStageController);

    function GeneralStageController($scope, Translate, toastr, ErrorHandler, stageProvider, $mdDialog, $log, _) {
        var vm = this;

        vm.asset = null;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('GENERAL_STAGE.BULK_ASSET');
        vm.assets_info = Translate.translate('GENERAL_STAGE.ACTIONS_MADE');
        vm.dialogTitle = Translate.translate('GENERAL_STAGE.ACTIONS.CLOSE');
        vm.confirmUpdate = Translate.translate('GENERAL_STAGE.ACTIONS.CONFIRM');
        vm.accept = Translate.translate('GENERAL_STAGE.ACTIONS.ACCEPT');
        vm.cancel = Translate.translate('GENERAL_STAGE.ACTIONS.CANCEL');


        vm.stage = {
            sucursal_id: null
        };
        vm.search = true;

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.getActions = getActions;
        vm.nextStep = nextStep;
        //--------------------------------------------------------------------------------------------------------------

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.clear = clear;
        vm.saveStage = saveStage;
        vm.closeStage = closeStage;
        vm.enableSearch = enableSearch;

        //Funciones Propias de la Pantalla
        function clear() {
            vm.stage = {
                etapa_siguiente_id: null,
                acciones_id: [],
                insumos_lote_usados: [],
                sucursal_id: null
            };
            vm.asset = null;
            vm.step = null;
        }

        function enableSearch() {
            vm.search = !vm.search;
            clear();

        }

        function closeStage() {
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
            if (!vm.stage.etapa_siguiente_id) {
                vm.stage = _.omit(vm.stage, 'etapa_siguiente_id');
            }
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
            if (!vm.actions) {
                vm.stage = _.omit(vm.stage, 'acciones_id');
            }
            if (vm.actions) {
                if (vm.actions.length === 0) {
                    vm.stage = _.omit(vm.stage, 'acciones_id');
                } else {
                    var index2;
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.stage.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            var confirm;
            confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.confirmUpdate)
                .ok(vm.accept)
                .cancel(vm.cancel);
            $mdDialog.show(confirm).then(function () {
                var promiseSendDiagnosis = stageProvider.sendStage(vm.step.currentStage.id, vm.stage);
                promiseSendDiagnosis.then(function (response) {
                    $log.info(response);
                    ErrorHandler.successCreation();
                    clear();

                }).catch(function (errormsg) {
                    $log.error(errormsg);
                    ErrorHandler.errorTranslate(errormsg);
                });
            }, function () {
            });
        }

        function saveStage() {
            if (!vm.stage.etapa_siguiente_id) {
                vm.stage = _.omit(vm.stage, 'etapa_siguiente_id');
            }
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
            if (!vm.actions) {
                vm.stage = _.omit(vm.stage, 'acciones_id');
            }
            if (vm.actions) {
                if (vm.actions.length === 0) {
                    vm.stage = _.omit(vm.stage, 'acciones_id');
                } else {
                    var index2;
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.stage.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            var promiseSendDiagnosis = stageProvider.sendStage(vm.step.currentStage.id, vm.stage);
            promiseSendDiagnosis.then(function (response) {
                $log.info(response);
                ErrorHandler.successCreation();
                clear();

            }).catch(function (errormsg) {
                $log.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }


        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            vm.stage.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {

            vm.step = step;
            var NOT_STEP = null;
            var SENT_TO_CHECK = null;
            if (angular.isUndefined(vm.step)) {

                NOT_STEP = Translate.translate('ERROR_STEP.NOT_STEP');
                SENT_TO_CHECK = Translate.translate('ERROR_STEP.GO_TO');
                toastr.warning(NOT_STEP, SENT_TO_CHECK);
                clear();
            }
            if (angular.isDefined(vm.step)) {
                if (angular.isDefined(vm.step.currentStage)) {
                    if ((vm.step.currentStage.etapa.tipo_etapa === 'Checklist') || (vm.step.currentStage.etapa.tipo_etapa === 'Diagnostico')|| (vm.step.currentStage.etapa.tipo_etapa === 'Pinchado')|| (vm.step.currentStage.etapa.tipo_etapa === 'Presurizado')) {
                        var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                        var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                        toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                        clear();

                    }
                }

                if (angular.isUndefined(vm.step.currentStage)) {
                    NOT_STEP = Translate.translate('ERROR_STEP.NOT_STEP');
                    SENT_TO_CHECK = Translate.translate('ERROR_STEP.GO_TO');
                    toastr.warning(NOT_STEP, SENT_TO_CHECK);
                    clear();
                }

            }

            vm.search = false;

        }


        function getInsumosLote(element) {
            //console.log(element);
            vm.stage.insumos_lote_usados = element;


        }

        function nextStep(step) {
            vm.stage.etapa_siguiente_id = step.id;
        }


        function getActions(element) {
            vm.actions = element;
            vm.stage.acciones_id = [];
            if (vm.actions) {
                if (vm.actions.length > 0) {

                    var index;
                    for (index = 0; index < vm.actions.length; ++index) {
                        vm.stage.acciones_id.push(vm.actions[index].com_code);
                    }
                }
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
