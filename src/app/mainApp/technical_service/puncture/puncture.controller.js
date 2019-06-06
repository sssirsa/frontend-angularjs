/**
 * Created by franciscojaviercerdamartinez on 2/13/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('PunctureController', PunctureController);
    function PunctureController($scope, Translate, ErrorHandler, punctureProvider, toastr, $log, _) {
        var vm = this;
        vm.asset = null;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('PUNCTURE.INITIAL_INFO');
        vm.assets_info = Translate.translate('PUNCTURE.MORE_INFO');
        vm.puncture = {
            cabinet_id: null,
            gas: false,
            observaciones: '',
            fecha_revision: null


        };

        //Declaracion de Funciones como variables_______________________________________________________________________

        vm.sendPuncture = sendPuncture;
        vm.clear = clear;


        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.getActions = getActions;
        vm.onStart = onStart;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla


        function sendPuncture() {
            vm.puncture.sucursal_id = vm.step.control.sucursal.id;
            vm.puncture.acciones_id = [];
            if (vm.puncture.insumos_lote) {
                if (vm.puncture.insumos_lote.length === 0) {
                    vm.puncture = _.omit(vm.puncture, 'insumos_lote');
                }
            }
            if (!vm.actions) {
                vm.puncture = _.omit(vm.puncture, 'acciones_id');
            }
            if (vm.actions) {
                if (vm.actions.length === 0) {
                    vm.puncture = _.omit(vm.puncture, 'acciones_id');
                } else {
                    var index2;
                    for (index2 = 0; index2 < vm.actions.length; ++index2) {
                        if (vm.actions[index2].com_code) {
                            vm.puncture.acciones_id.push(vm.actions[index2].com_code);
                        }
                    }
                }
            }
            var promiseSendPuncture = punctureProvider.makePuncture(vm.puncture, vm.step.currentStage.id);
            promiseSendPuncture.then(function () {

                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function clear() {
            vm.puncture = null;
            vm.asset = null;
            vm.step = null;
        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            if (vm.puncture) {
                vm.puncture.cabinet_id = vm.asset.economico;
            }
        }

        function infoStep(step) {
            vm.step = step;
            if (vm.step) {
                if (!vm.step.currentStage) {
                    var NOT_STEP = Translate.translate('ERROR_STEP.NOT_STEP');
                    var SENT_TO_CHECK = Translate.translate('ERROR_STEP.GO_TO');
                    toastr.warning(NOT_STEP, SENT_TO_CHECK);
                    clear();
                }
                if (vm.step.currentStage.etapa.nombre !== 'Pinchado') {
                    var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                    var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                    toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                    clear();

                }
            }

        }

        function getInsumosLote(element) {
            vm.puncture.insumos_lote = element;
        }

        function onStart(startDate) {
            vm.puncture.fecha_revision = moment(startDate).format('YYYY-MM-DD[T]HH:mm:ss.SSSSSS[Z]');

        }

        function getActions(acciones) {
            vm.actions = acciones;

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
