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
        vm.sendDiagnosis=sendDiagnosis;

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
            if(vm.step.currentStage.diagnostico){
                vm.diagnostic.nombre_corto=vm.step.currentStage.diagnostico.nombre_corto;
                vm.diagnostic.amp_arran=vm.step.currentStage.diagnostico.amp_arran;
                vm.diagnostic.amp_trab=vm.step.currentStage.diagnostico.amp_trab;
                vm.diagnostic.descripcion=vm.step.currentStage.diagnostico.descripcion;
                vm.diagnostic.en_tiempo=vm.step.currentStage.diagnostico.en_tiempo;
                vm.diagnostic.fallas=vm.step.currentStage.diagnostico.fallas;
                vm.diagnostic.temp_com=vm.step.currentStage.diagnostico.temp_com;
                vm.diagnostic.temp_int=vm.step.currentStage.diagnostico.temp_int;
            }
        }

        function sendDiagnosis() {
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

        function getFailures(failures) {
            vm.failures = failures;
            console.log(vm.failures);

        }
        function nextStep(step) {
            console.log("siguiente etapa:"+step);

        }

        function getActions(acciones) {
            vm.actions = acciones;

        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
