/**
 * Created by franciscojaviercerdamartinez on 1/10/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('diagnosisController', diagnosisController);

    function diagnosisController($scope, Translate, toastr, cabinetUC, ErrorHandler) {
        var vm = this;

        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id=''; //asset identifier
        vm.title_info=Translate.translate('DIAGNOSIS.DIAGNOSIS_INFO');
        vm.assets_info=Translate.translate('INSPECTION.MORE_INFO');

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
            console.log(step.currentStage.id);
            console.log(step.currentStage.servicio_cabinet);
            vm.step = step;

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
