/**
 * Created by franciscojaviercerdamartinez on 4/12/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('PresurizeController', PresurizeController);
    function PresurizeController($scope, Translate, ErrorHandler, presurizeProvider, toastr, $log, _, OPTIONS) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('PUNCTURE.INITIAL_INFO');
        vm.assets_info = Translate.translate('PUNCTURE.MORE_INFO');
        vm.presurize = {
            cabinet_id: null,
            gas: false,
            observaciones: '',
            fecha_revision: null


        };
        vm.options = OPTIONS.technical_service.presurize_options;

        //Declaracion de Funciones como variables_______________________________________________________________________

        vm.sendPresurize = sendPresurize;
        vm.clear = clear;
        vm.timeStampCheck = timeStampCheck;
        vm.timeStampCharge = timeStampCharge;


        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.getActions = getActions;
        vm.onStart = onStart;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla


        function sendPresurize() {
            vm.presurize.sucursal_id = vm.step.control.sucursal.id;
            vm.presurize.acciones_id = [];
            if (vm.option_to_do) {
                switch (vm.option_to_do) {
                    case '1':
                        vm.presurize.liberado = true;
                        vm.presurize.etapa_string = 'Diagnostico';
                        break;
                    case '2':
                        vm.presurize.liberado = false;
                        vm.presurize.etapa_string = 'Continuar';
                        break;
                    case '3':
                        vm.presurize.liberado = true;
                        vm.presurize.etapa_string = 'Presurizado';
                        break;
                    case '4':
                        vm.presurize.liberado = false;
                        vm.presurize.etapa_string = 'Obsoleto';
                }
            }
            else {
                vm.presurize.liberado = false;
                vm.presurize.etapa_string = 'Continuar';
            }
            if (vm.presurize.insumos_lote) {
                if (vm.presurize.insumos_lote.length === 0) {
                    vm.presurize = _.omit(vm.presurize, 'insumos_lote');
                }
            }
            if (!vm.actions) {
                vm.presurize = _.omit(vm.presurize, 'acciones_id');
            }
            if (vm.actions) {
                if (vm.actions.length === 0) {
                    vm.presurize = _.omit(vm.presurize, 'acciones_id');
                } else {
                    var index2;
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.presurize.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            var promiseSendPresurize = presurizeProvider.makePressurize(vm.presurize, vm.step.currentStage.id);
            promiseSendPresurize.then(function () {
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function timeStampCheck() {
            vm.presurize.fecha_revision = new Date();
        }

        function timeStampCharge() {
            vm.presurize.fecha_carga = new Date();
        }

        function clear() {
            vm.presurize = null;
            vm.asset = null;
            vm.step = null;
            vm.option_to_do = null;
        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            if (vm.presurize) {
                vm.presurize.cabinet_id = vm.asset.economico;
            }
        }

        function infoStep(step) {
            vm.step = step;
            if (angular.isDefined(vm.step)) {

                if (angular.isDefined(vm.step.currentStage)) {
                    if (vm.step.currentStage.etapa.nombre !== 'Presurizado') {
                        var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                        var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                        toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                        clear();

                    }
                }
                if (vm.step != null) {
                    if (angular.isUndefined(vm.step.currentStage)) {
                        var NOT_STEP = Translate.translate('ERROR_STEP.NOT_STEP');
                        var SENT_TO_CHECK = Translate.translate('ERROR_STEP.GO_TO');
                        toastr.warning(NOT_STEP, SENT_TO_CHECK);
                        clear();
                    }
                }
            }

        }

        function getInsumosLote(element) {
            vm.presurize.insumos_lote_usados = element;
        }

        function onStart(startDate) {
            vm.presurize.fecha_revision = moment(startDate).format('YYYY-MM-DD[T]HH:mm:ss.SSSSSS[Z]');

        }

        function getActions(acciones) {
            vm.actions = acciones;

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
