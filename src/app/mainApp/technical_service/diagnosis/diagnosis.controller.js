/**
 * Created by franciscojaviercerdamartinez on 1/10/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('DiagnosisController', DiagnosisController);

    function DiagnosisController($scope, Translate, toastr, ErrorHandler, diagnosisProvider, $log) {
        var vm = this;

        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('DIAGNOSIS.DIAGNOSIS_INFO');
        vm.failures_and_actions = Translate.translate('DIAGNOSIS.FAILURES_ACTIONS');
        vm.bulkAssets = Translate.translate('DIAGNOSIS.BULK_ASSETS');

        vm.diagnostic = {
            nombre_corto: undefined,
            descripcion: undefined,
            fallas_id: [],
            en_tiempo: true,
            temp_com: undefined,
            temp_int: undefined,
            amp_arran: undefined,
            amp_trab: undefined,
            etapa_siguiente_id: undefined,
            acciones_id: [],
            insumos_lote: [],
            sucursal_id: undefined
        };
        vm.search = true;

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.getFailures = getFailures;
        vm.getActions = getActions;
        vm.nextStep = nextStep;
        //--------------------------------------------------------------------------------------------------------------

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.clear = clear;
        vm.sendDiagnosis = sendDiagnosis;
        vm.enableSearch = enableSearch;

        //Funciones Propias de la Pantalla
        function clear() {
            vm.diagnostic = {
                nombre_corto: undefined,
                descripcion: undefined,
                fallas_id: [],
                en_tiempo: true,
                temp_com: undefined,
                temp_int: undefined,
                amp_arran: undefined,
                amp_trab: undefined,
                etapa_siguiente_id: undefined,
                acciones_id: [],
                insumos_lote: [],
                sucursal_id: undefined
            };
            vm.asset = undefined;
            vm.step = undefined;
            vm.search = true;
        }

        function sendDiagnosis() {
            vm.diagnostic.sucursal_id = vm.step.control.sucursal.id;
            var promiseSendDiagnosis = diagnosisProvider.sendDiagnosis(vm.step.currentStage.id, vm.diagnostic);
            promiseSendDiagnosis.then(function (response) {
                $log.info(response);
                clear();

            }).catch(function (errormsg) {
                $log.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function enableSearch() {
            vm.search = !vm.search;
            clear();

        }


        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            vm.diagnostic.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            $log.debug('etapa actual:');
            $log.debug(step);
            $log.debug(step.currentStage.id);
            $log.debug(step.currentStage.servicio_cabinet);
            vm.step = step;
            vm.search = false;
            if (vm.step.currentStage.diagnostico) {
                vm.diagnostic.nombre_corto = vm.step.currentStage.diagnostico.nombre_corto;
                vm.diagnostic.amp_arran = parseFloat(vm.step.currentStage.diagnostico.amp_arran);
                vm.diagnostic.amp_trab = parseFloat(vm.step.currentStage.diagnostico.amp_trab);
                vm.diagnostic.descripcion = vm.step.currentStage.diagnostico.descripcion;
                vm.diagnostic.en_tiempo = vm.step.currentStage.diagnostico.en_tiempo;
                vm.diagnostic.fallas = vm.step.currentStage.diagnostico.fallas;
                vm.diagnostic.temp_com = parseFloat(vm.step.currentStage.diagnostico.temp_com);
                vm.diagnostic.temp_int = parseFloat(vm.step.currentStage.diagnostico.temp_int);
                $log.debug(vm.diagnostic);
                $log.debug(vm.step.currentStage.acciones);
            }

            if (vm.step.currentStage.etapa.nombre !== 'Diagnostico') {
                $log.debug("No en la etapa Correcta");
                var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                clear();

            }
        }


        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function getFailures(failures) {
            vm.failures = failures;
            $log.debug(vm.failures);
            var index;
            if (vm.failures.length > 0) {
                vm.diagnostic.fallas_id = [];
                for (index = 0; index < vm.failures.length; ++index) {
                    vm.diagnostic.fallas_id.push(vm.failures[index].com_code);
                }

                $log.debug("Fallas");
                $log.debug(vm.failures);
                $log.debug(vm.diagnostic.fallas_id);
            }

        }

        function nextStep(step) {
            $log.debug("siguiente etapa:");
            $log.debug(step);
            vm.diagnostic.etapa_siguiente_id = step.id;

        }

        function getActions(element) {
            $log.debug('acciones detectadas:');
            $log.debug(element);
            vm.actions = element;
            vm.diagnostic.acciones_id = [];
            if (vm.actions) {
                if (vm.actions.length > 0) {

                    var index;
                    for (index = 0; index < vm.actions.length; ++index) {
                        vm.diagnostic.acciones_id.push(vm.actions[index].com_code);
                    }
                    $log.debug("Acciones");
                    $log.debug(vm.actions);
                    $log.debug(vm.diagnostic.acciones_id);
                }
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
