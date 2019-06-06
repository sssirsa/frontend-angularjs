/**
 * Created by franciscojaviercerdamartinez on 1/10/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('DiagnosisController', DiagnosisController);

    function DiagnosisController($scope, Translate, toastr, ErrorHandler, diagnosisProvider, $log,_) {
        var vm = this;

        vm.asset = null;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('DIAGNOSIS.DIAGNOSIS_INFO');
        vm.failures_and_actions = Translate.translate('DIAGNOSIS.FAILURES_ACTIONS');
        vm.bulkAssets = Translate.translate('DIAGNOSIS.BULK_ASSETS');

        vm.diagnostic = {
            nombre_corto: null,
            descripcion: null,
            fallas_id: [],
            en_tiempo: true,
            temp_com: null,
            temp_int: null,
            amp_arran: null,
            amp_trab: null,
            etapa_siguiente_id: null,
            acciones_id: [],
            insumos_lote_usados: [],
            sucursal_id: null
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
                nombre_corto: null,
                descripcion: null,
                fallas_id: [],
                en_tiempo: true,
                temp_com: null,
                temp_int: null,
                amp_arran: null,
                amp_trab: null,
                etapa_siguiente_id: null,
                acciones_id: [],
                insumos_lote_usados: [],
                sucursal_id: null
            };
            vm.asset = null;
            vm.step = null;
            vm.search = true;
        }

        function sendDiagnosis() {
            vm.diagnostic.sucursal_id = vm.step.control.sucursal.id;
            if (vm.diagnostic.insumos_lote_usados) {
                if (vm.diagnostic.insumos_lote_usados.length === 0) {
                    vm.diagnostic = _.omit(vm.presurize, 'insumos_lote_usados');
                }
            }
            if (!vm.actions){
                vm.diagnostic = _.omit(vm.diagnostic, 'acciones_id');
            }
            if (vm.actions) {
                if (vm.actions.length === 0) {
                    vm.diagnostic = _.omit(vm.diagnostic, 'acciones_id');
                } else {
                    var index2;
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.diagnostic.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            if (!vm.failures){
                vm.diagnostic = _.omit(vm.diagnostic, 'fallas_id');
            }
            if (vm.failures) {
                if (vm.failures.length === 0) {
                    vm.diagnostic = _.omit(vm.diagnostic, 'fallas_id');
                } else {
                    var index3;
                    for (index3 = 0; index3 < vm.failures.length; ++index3) {
                        if (vm.failures[index3].com_code) {
                            vm.diagnostic.fallas_id.push(vm.failures[index3].com_code);
                        }
                    }
                }
            }
            var promiseSendDiagnosis = diagnosisProvider.sendDiagnosis(vm.step.currentStage.id, vm.diagnostic);
            promiseSendDiagnosis.then(function () {
                ErrorHandler.successCreation();
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

            }

            if (vm.step.currentStage.etapa.tipo_etapa !== 'Diagnostico') {
                var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                clear();

            }
        }


        function getInsumosLote(element) {
            vm.diagnostic.insumos_lote_usados = element;
        }

        function getFailures(failures) {
            vm.failures = failures;
            var index;
            if (vm.failures.length > 0) {
                vm.diagnostic.fallas_id = [];
                for (index = 0; index < vm.failures.length; ++index) {
                    vm.diagnostic.fallas_id.push(vm.failures[index].com_code);
                }

            }

        }

        function nextStep(step) {
            vm.diagnostic.etapa_siguiente_id = step.id;

        }

        function getActions(element) {
            vm.actions = element;
            vm.diagnostic.acciones_id = [];
            if (vm.actions) {
                if (vm.actions.length > 0) {

                    var index;
                    for (index = 0; index < vm.actions.length; ++index) {
                        vm.diagnostic.acciones_id.push(vm.actions[index].com_code);
                    }
                }
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
