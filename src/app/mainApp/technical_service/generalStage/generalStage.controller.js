/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('GeneralStageController', GeneralStageController);

    function GeneralStageController($scope, Translate, toastr, ErrorHandler, stageProvider, $mdDialog, $log, _) {
        var vm = this;

        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('GENERAL_STAGE.BULK_ASSET');
        vm.assets_info = Translate.translate('GENERAL_STAGE.ACTIONS_MADE');

        vm.stage = {
            sucursal_id: undefined
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
                etapa_siguiente_id: undefined,
                acciones_id: [],
                insumos_lote: [],
                sucursal_id: undefined
            };
            vm.asset = undefined;
            vm.step = undefined;
        }

        function enableSearch() {
            vm.search = !vm.search;
            clear();

        }

        function closeStage() {
            $log.debug(vm.stage);
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
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
                    clear();

                }).catch(function (errormsg) {
                    $log.error(errormsg);
                    ErrorHandler.errorTranslate(errormsg);
                });
            }, function () {
            });
        }

        function saveStage() {
            $log.debug(vm.stage);
            if (vm.stage.etapa_siguiente_id) {
                vm.stage = _.omit(vm.stage, 'etapa_siguiente_id');
            }
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
            var promiseSendDiagnosis = stageProvider.sendStage(vm.step.currentStage.id, vm.stage);
            promiseSendDiagnosis.then(function (response) {
                $log.info(response);
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
            $log.debug('etapa actual:');
            $log.debug(step);
            $log.debug(step.currentStage.id);
            $log.debug(step.currentStage.servicio_cabinet);
            vm.step = step;
            vm.search = false;

        }


        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function nextStep(step) {
            $log.debug("siguiente etapa:");
            $log.debug(step);
            vm.stage.etapa_siguiente_id = step.id;

        }

        function getActions(element) {
            $log.debug('acciones detectadas:');
            $log.debug(element);
            vm.actions = element;
            vm.stage.acciones_id = [];
            if (vm.actions) {
                if (vm.actions.length > 0) {

                    var index;
                    for (index = 0; index < vm.actions.length; ++index) {
                        vm.stage.acciones_id.push(vm.actions[index].com_code);
                    }
                    $log.debug("Acciones");
                    $log.debug(vm.actions);
                    $log.debug(vm.stage.acciones_id);
                }
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
