/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('generalStageController', generalStageController);

    function generalStageController($scope, Translate, toastr, ErrorHandler, stageProvider, $mdDialog) {
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
            console.log(vm.stage)
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
                    console.info(response);
                    clear();

                }).catch(function (errormsg) {
                    console.error(errormsg);
                    ErrorHandler.errorTranslate(errormsg);
                });
            }, function () {
            });
        }
        function saveStage() {
            console.log(vm.stage)
            if (vm.stage.etapa_siguiente_id) {
                vm.stage = _.omit(vm.stage, etapa_siguiente_id);
            }
            vm.stage.sucursal_id = vm.step.control.sucursal.id;
            var promiseSendDiagnosis = stageProvider.sendStage(vm.step.currentStage.id, vm.stage);
            promiseSendDiagnosis.then(function (response) {
                console.info(response);
                clear();

            }).catch(function (errormsg) {
                console.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }


        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            vm.stage.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            console.log('etapa actual:');
            console.log(step);
            console.log(step.currentStage.id);
            console.log(step.currentStage.servicio_cabinet);
            vm.step = step;
            vm.search = false;

        }



        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function nextStep(step) {
            console.log("siguiente etapa:");
            console.log(step);
            vm.stage.etapa_siguiente_id = step.id;

        }

        function getActions(element) {
            console.log('acciones detectadas:');
            console.log(element);
            vm.actions = element;
            vm.stage.acciones_id = [];
            if (vm.actions) {
                if (vm.actions.length > 0) {

                    var index;
                    for (index = 0; index < vm.actions.length; ++index) {
                        vm.stage.acciones_id.push(vm.actions[index].com_code);
                    }
                    console.log("Acciones");
                    console.log(vm.actions);
                    console.log(vm.stage.acciones_id);
                }
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
