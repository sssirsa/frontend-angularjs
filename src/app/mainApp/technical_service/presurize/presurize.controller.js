/**
 * Created by franciscojaviercerdamartinez on 4/12/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('PresurizeController', PresurizeController);
    function PresurizeController($scope, Translate, ErrorHandler, presurizeProvider, toastr, $log, _) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('PUNCTURE.INITIAL_INFO');
        vm.assets_info = Translate.translate('PUNCTURE.MORE_INFO');
        vm.presurize = {
            cabinet_id: undefined,
            gas: false,
            observaciones: '',
            fecha_revision: undefined


        };
        vm.options = [
            {
                name: "Corregida la fuga",
                value: "Diagnostico"
            },
            {
                name: "Necesario Obsoletizar",
                value: "Obsoleto"
            },
            {
                name: "Requiere una nueva Carga de Gas y reparación",
                value: "Presurizado"
            },
            {
                name: "Requiere una Revisión Posterior",
                value: "Continuar"
            }
        ];

        //Declaracion de Funciones como variables_______________________________________________________________________

        vm.sendPresurize = sendPresurize;
        vm.clear = clear;


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
            if (vm.presurize.insumos_lote) {
                if (vm.presurize.insumos_lote.length === 0) {
                    vm.presurize = _.omit(vm.presurize, 'insumos_lote');
                }
            }
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
            var promiseSendPresurize = presurizeProvider.makePressurize(vm.presurize, vm.step.currentStage.id);
            promiseSendPresurize.then(function (response) {
                $log.debug(response);
                ErrorHandler.successCreation();
                clear();
            }).catch(function (errormsg) {
                $log.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function clear() {
            vm.presurize = undefined;
            vm.asset = undefined;
            vm.step = undefined;
        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            if (vm.presurize) {
                vm.presurize.cabinet_id = vm.asset.economico;
            }
        }

        function infoStep(step) {
            $log.debug(step.currentStage);
            vm.step = step;

            if (!vm.step) {
                $log.debug();
                var NOT_STEP = Translate.translate('ERROR_STEP.NOT_STEP');
                var SENT_TO_CHECK = Translate.translate('ERROR_STEP.GO_TO');
                toastr.warning(NOT_STEP, SENT_TO_CHECK);
                clear();
            }
            if (vm.step.currentStage.etapa.nombre !== 'Pinchado') {
                $log.debug("No en la etapa Correcta");
                var NOT_CORRECT_STEP = Translate.translate('ERROR_STEP.NOT_CORRECT_STEP');
                var SENT_TO = Translate.translate('ERROR_STEP.GO_TO');
                toastr.warning(NOT_CORRECT_STEP, SENT_TO + " " + vm.step.currentStage.etapa.nombre);
                clear();

            }

        }

        function getInsumosLote(element) {
            vm.presurize.insumos_lote = element;
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
