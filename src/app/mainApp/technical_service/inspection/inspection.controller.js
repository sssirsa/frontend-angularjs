/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('inspectionController', inspectionController);
    function inspectionController($scope, Translate, ErrorHandler, EnvironmentConfig, URLS, inspectionProvider) {
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
            observaciones: '',


        };

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.sendPrecheck = sendPrecheck;
        vm.sendInspection = sendInspection;
        vm.sendCheckList = sendCheckList;
        vm.clear = clear;

        const stickersURL = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.sticker);
        vm.catalogues = {
            sticker: {
                catalog: {
                    url: stickersURL,
                    name: Translate.translate('INSPECTION.CATALOGUES.STICKER'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                },
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
            vm.checklist.sucursal_id=vm.step.control.sucursal.id;
            var promiseSendInspection = inspectionProvider.makeInspection(vm.checklist);
            promiseSendInspection.then(function (response) {
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                console.log(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }

        function sendCheckList() {
            console.log(vm.checklist);

        }

        function sendPrecheck() {
            vm.checklist.sucursal_id=vm.step.control.sucursal.id;
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
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                console.log(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function clear() {
            vm.checklist = undefined;
            vm.asset = undefined;
            vm.step = undefined;
        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            vm.checklist.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            console.log(step.currentStage.servicio_cabinet);
            vm.step = step;

        }

        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function onStickerSelect(value) {
            //console.log(value);
            vm.checklist.sticker_id = value;

        }

        function getSymptoms(symptoms) {
            vm.symptoms = symptoms;

        }

        function getActions(acciones) {
            vm.actions = acciones;

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
