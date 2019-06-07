/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('InspectionController', InspectionController);
    function InspectionController($scope, Translate, ErrorHandler, EnvironmentConfig, URLS, inspectionProvider, toastr, $log, _, PAGINATION) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.CHECKLIST');
        vm.assets_info = Translate.translate('INSPECTION.MORE_INFO');
        vm.checklist = {
            cabinet_id: null,
            sticker_id: null,
            rodajas: null,
            canastillas: null,
            rejillas_traseras: null,
            rejillas_delanteras: null,
            puertas: null,
            pintura: false,
            lavado: false,
            emplayado: false,
            vacio_mercancia: false,
            gas: false,
            terminado: false,
            listo_para_salida: false,
            observaciones: ''

        };
        vm.stage = {
            sucursal_id: null
        };

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.sendPrecheck = sendPrecheck;
        vm.sendInspection = sendInspection;
        vm.sendCheckList = sendCheckList;
        vm.clear = clear;

        var stickersURL = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.sticker);
        vm.catalogues = {
            sticker: {
                catalog: {
                    url: stickersURL,
                    name: Translate.translate('INSPECTION.CATALOGUES.STICKER'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion',
                    pagination: {
                        total: PAGINATION.total,
                        limit: PAGINATION.limit,
                        offset: PAGINATION.offset,
                        pageSize: PAGINATION.pageSize
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true,
                noResults: Translate.translate('ERRORS.NO_RESULTS'),
                hint: Translate.translate('INSPECTION.CATALOGUES.ADD')
            }
        };

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.onStickerSelect = onStickerSelect;
        vm.getSymptoms = getSymptoms;
        vm.getActions = getActions;
        vm.nextStep = nextStep;
        //-------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla
        function sendInspection() {
            vm.checklist.sucursal_id = vm.step.control.sucursal.id;
            if(vm.checklist.observaciones===null || angular.isUndefined(vm.checklist.observaciones) ||vm.checklist.observaciones==='' ){
                vm.checklist = _.omit(vm.checklist, 'observaciones');
            }
            var promiseSendInspection = inspectionProvider.makeInspection(vm.checklist);
            promiseSendInspection.then(function (response) {
                $log.debug(response);
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.debug(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }

        function sendCheckList() {
            vm.checklist.sucursal_id = vm.step.control.sucursal.id;
            if(vm.checklist.observaciones===null || angular.isUndefined(vm.checklist.observaciones) ||vm.checklist.observaciones==='' ){
                vm.checklist = _.omit(vm.checklist, 'observaciones');
            }
            if (vm.checklist.insumos_lote_usados) {
                if (vm.checklist.insumos_lote_usados.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'insumos_lote_usados');
                }
            }
            if (angular.isDefined(vm.symptoms)) {
                if (vm.symptoms.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'sintomas_detectados_id');
                } else {
                    var index;
                    vm.checklist.sintomas_detectados_id = [];
                    for (index = 0; index < vm.symptoms.length; ++index) {
                        if (vm.symptoms[index].code) {
                            vm.checklist.sintomas_detectados_id.push(vm.symptoms[index].code);
                        }
                    }
                }
            }
            if (angular.isDefined(vm.actions)) {
                if (vm.actions.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'acciones_id');
                } else {
                    var index2;
                    vm.checklist.acciones_id = [];
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.checklist.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            if (!vm.checklist.etapa_siguiente_id) {
                vm.checklist = _.omit(vm.checklist, 'etapa_siguiente_id');
            }
            var promiseSendCheck = inspectionProvider.makeChecklist(vm.checklist, vm.step.currentStage.id);
            promiseSendCheck.then(function (response) {
                $log.debug(response);
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.debug(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }

        function sendPrecheck() {
            vm.checklist.sucursal_id = vm.step.control.sucursal.id;
            if(vm.checklist.observaciones===null || angular.isUndefined(vm.checklist.observaciones) ||vm.checklist.observaciones==='' ){
                vm.checklist = _.omit(vm.checklist, 'observaciones');
            }
            if (vm.checklist.insumos_lote_usados) {
                if (vm.checklist.insumos_lote_usados.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'insumos_lote_usados');
                }
            }
            if (angular.isDefined(vm.symptoms)) {
                if (vm.symptoms.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'sintomas_detectados_id');
                } else {
                    var index;
                    vm.checklist.sintomas_detectados_id = [];
                    for (index = 0; index < vm.symptoms.length; ++index) {
                        if (vm.symptoms[index].code) {
                            vm.checklist.sintomas_detectados_id.push(vm.symptoms[index].code);
                        }
                    }
                }
            }
            if (angular.isDefined(vm.actions)) {
                if (vm.actions.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'acciones_id');
                } else {
                    var index2;
                    vm.checklist.acciones_id = [];
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.checklist.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            var promiseSendPreCheck = inspectionProvider.makePrecheck(vm.checklist);
            promiseSendPreCheck.then(function (response) {
                $log.debug(response);
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.debug(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function clear() {
            vm.checklist = {
                cabinet_id: null,
                sticker_id: null,
                rodajas: null,
                canastillas: null,
                rejillas_traseras: null,
                rejillas_delanteras: null,
                puertas: null,
                pintura: false,
                lavado: false,
                emplayado: false,
                vacio_mercancia: false,
                gas: false,
                observaciones: ''
            };
            vm.asset = null;
            vm.step = null;
            vm.stage_for_not_stage = null;
        }

        //  Funciones para Componentes ___________________________________________________________________________ .all(URL.technical_service.catalogues.stage);______

        function infogral(cabinet) {
            vm.asset = undefined;
            vm.asset = cabinet;
            vm.checklist.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            vm.step = undefined;
            vm.step = step;

            if (!vm.step.currentStage) {
                var promiseStep = inspectionProvider.getStep();
                promiseStep.then(function (stage) {
                    vm.stage_for_not_stage = stage.results[0];
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
                if (vm.step.control.inspeccionado) {
                    if (vm.step.control.inspeccionado.estado) {
                        if (vm.step.control.inspeccionado.estado === 'Confirmado') {
                            var DENEGATE = Translate.translate('ERROR_STEP.DENEGATE');
                            var REVIEWED = Translate.translate('ERROR_STEP.REVIEWED');
                            toastr.warning(DENEGATE, REVIEWED);
                            clear();
                        }
                    }
                }
            }
            if (vm.step) {
                if (angular.isDefined(vm.step.currentStage)) {
                    if (angular.isDefined(vm.step.currentStage.etapa)) {
                        if ((vm.step.currentStage.etapa.tipo_etapa !== 'Checklist') || ( vm.stage_for_not_stage.nombre !== 'CheckList')) {
                            var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                            var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                            toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                            clear();

                        }
                    }
                }
            }


        }

        function getInsumosLote(element) {
            vm.checklist.insumos_lote_usados = element;
        }

        function onStickerSelect(value) {

            vm.checklist.sticker_id = value;

        }

        function getSymptoms(symptoms) {

            vm.symptoms = symptoms;

        }

        function getActions(element) {

            vm.actions = element;
        }

        function nextStep(step) {
            vm.checklist.etapa_siguiente_id = step.id;

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
