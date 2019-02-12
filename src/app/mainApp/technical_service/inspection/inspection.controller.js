/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('inspectionController', inspectionController);
    function inspectionController($scope, Translate, ErrorHandler) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id=''; //asset identifier
        vm.title_info=Translate.translate('INSPECTION.CHECKLIST');
        vm.assets_info=Translate.translate('INSPECTION.MORE_INFO');
        vm.checklist={};

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral=infogral;
        vm.infoStep=infoStep;
        vm.getInsumosLote=getInsumosLote;
        vm.buildObject=buildObject;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla
        function buildObject() {
            console.log(vm.checklist);

        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset=cabinet;

        }
        function infoStep(step) {
            vm.step=step;

        }
        function getInsumosLote(element){
            console.log(element);
        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
