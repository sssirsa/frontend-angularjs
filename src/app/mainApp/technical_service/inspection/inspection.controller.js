/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('InspectionController', InspectionController);
    function InspectionController($scope, Translate, ErrorHandler, EnvironmentConfig, URLS, inspectionProvider, toastr, $log,_) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.CHECKLIST');
        vm.assets_info = Translate.translate('INSPECTION.MORE_INFO');
        vm.checklist = {
            cabinet_id: undefined,
            sticker_id: undefined,
            rodajas: undefined,
            canastillas: undefined,
            rejillas_traseras: undefined,
            rejillas_delanteras: undefined,
            puertas: undefined,
            pintura: false,
            lavado: false,
            emplayado: false,
            vacio_mercancia: false,
            gas: false,
            observaciones: ''
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
                        total: 'count',
                        next: 'next'
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
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla
        function sendInspection() {
            vm.checklist.sucursal_id = vm.step.control.sucursal.id;
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
            $log.debug(vm.checklist);

        }

        function sendPrecheck() {
            vm.checklist.sucursal_id = vm.step.control.sucursal.id;
            vm.checklist.sintomas_detectados_id = [];
            vm.checklist.acciones_id = [];
            if (vm.checklist.insumos_lote) {
                if (vm.checklist.insumos_lote.length === 0) {
                    vm.checklist = _.omit(vm.checklist, 'insumos_lote');
                }
            }
            if (vm.symptoms.length === 0) {
                vm.checklist = _.omit(vm.checklist, 'sintomas_detectados_id');
            } else {
                var index;
                for (index = 0; index < vm.symptoms.length; ++index) {
                    if (vm.symptoms[index].code) {
                        vm.checklist.sintomas_detectados_id.push(vm.symptoms[index].code);
                    }
                }
            }
            if (vm.actions.length === 0) {
                vm.checklist = _.omit(vm.checklist, 'acciones_id');
            } else {
                var index2;
                for (index2 = 0; index2 < vm.actions.length; ++index2) {
                    if (vm.actions[index2].com_code) {
                        vm.checklist.acciones_id.push(vm.actions[index2].com_code);
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
                cabinet_id: undefined,
                sticker_id: undefined,
                rodajas: undefined,
                canastillas: undefined,
                rejillas_traseras: undefined,
                rejillas_delanteras: undefined,
                puertas: undefined,
                pintura: false,
                lavado: false,
                emplayado: false,
                vacio_mercancia: false,
                gas: false,
                observaciones: ''
            };
            vm.asset = undefined;
            vm.step = undefined;
            vm.stage_for_not_stage = undefined;
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
            $log.debug("etapa del cabinet");
            $log.debug(vm.step);
            $log.debug("etapa envidada a la función");
            $log.debug(step);
            if (!vm.step.currentStage) {
                $log.debug('entre al if');
                var promiseStep = inspectionProvider.getStep();
                promiseStep.then(function (stage) {
                    $log.debug(stage);
                    vm.stage_for_not_stage = stage.results[0];
                    $log.debug("stage_for_not_stage:");
                    $log.debug(vm.stage_for_not_stage);
                }).catch(function (errormsg) {
                    $log.debug(errormsg);
                    ErrorHandler.errorTranslate(errormsg);
                });
            }
            if (vm.step.currentStage) {
                if (vm.step.currentStage.etapa.nombre !== 'CheckList' || vm.stage_for_not_stage.nombre !== 'CheckList') {
                    $log.debug("No en la etapa Correcta");
                    var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                    var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                    toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                    clear();

                }
            }

        }

        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function onStickerSelect(value) {
            // $log.debug(value);
            vm.checklist.sticker_id = value;

        }

        function getSymptoms(symptoms) {
            // $log.debug(symptoms)
            vm.symptoms = symptoms;

        }

        function getActions(element) {
            //console.log(element);
            vm.actions = element;
        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
