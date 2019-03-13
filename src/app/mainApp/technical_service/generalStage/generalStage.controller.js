/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('generalStageController', generalStageController);

    function generalStageController($scope, Translate, toastr, ErrorHandler,diagnosisProvider) {
        var vm = this;

        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id=''; //asset identifier
        vm.title_info=Translate.translate('GENERAL_STAGE.BULK_ASSET');
        vm.assets_info=Translate.translate('GENERAL_STAGE.ACTIONS_MADE');

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
            acciones_id:[],
            insumos_lote:[],
            sucursal_id:undefined
        };
        vm.search=true;

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
        vm.sendStage=sendStage;
        vm.enableSearch=enableSearch;

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
                acciones_id:[],
                insumos_lote:[],
                sucursal_id:undefined
            };
            vm.asset = undefined;
            vm.step = undefined;
        }

        function enableSearch() {
            vm.search=!vm.search;
            clear();

        }



        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            vm.diagnostic.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            console.log('etapa actual:');
            console.log(step);
            console.log(step.currentStage.id);
            console.log(step.currentStage.servicio_cabinet);
            vm.step = step;
            vm.search=false;

        }

        function sendStage() {
            console.log(vm.stage)
            var promiseSendDiagnosis=diagnosisProvider.sendDiagnosis(vm.step.currentStage.id,vm.diagnostic);
            promiseSendDiagnosis.then(function(response){
                console.info(response);
                clear();

            }).catch(function (errormsg) {
                console.error(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }

        function getInsumosLote(element) {
            vm.checklist.insumos_lote = element;
        }

        function nextStep(step) {
            console.log("siguiente etapa:");
            console.log(step);
            vm.stage.etapa_siguiente_id = step.id;

        }

        function getActions(acciones) {
            vm.actions = acciones;
            if (vm.failures.length > 0) {
                vm.diagnostic.acciones_id = [];
                var index;
                for (index = 0; index < vm.actions.length; ++index) {
                    vm.diagnostic.acciones_id.push(vm.actions[index].com_code);
                }
                console.log("Acciones");
                cosole.log(vm.actions)
                console.log(vm.diagnostic.acciones_id);
            }

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
