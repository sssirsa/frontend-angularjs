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

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral=infogral;
        vm.infoStep=infoStep;
        vm.onStart=onStart;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla


        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset=cabinet;
            //console.log(vm.asset);
        }
        function infoStep(step) {
            vm.step=step;
            console.log(vm.step);
        }
        function onStart(startDate){
            console.log(startDate);
        }
        //--------------------------------------------------------------------------------------------------------------


    }


})();
