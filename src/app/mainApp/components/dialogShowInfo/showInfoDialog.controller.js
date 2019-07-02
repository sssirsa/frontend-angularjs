/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .controller('showInfotDialogController', showInfotDialogController);

    function showInfotDialogController(array, title, meta, $mdDialog) {
        var vm = this;
        vm.title=title;
        vm.closeDialog=closeDialog;
        vm.array =array;
        vm.meta=meta;
        /*
        Ejemplo del objeto de meta y su significado
         var object = [
         {
         section: 'Nombre de la sección', //Nombre del Campo a Mostrar
         key: 'asset',//
         icon:'fas fa-user',//Icono de zmdi o font awsome
         kind: 'Object',// se específica el tipo si es objeto ='Object' o campo 'Field' stringify, multiple value stringify, file archivo URL, image imagen
         content: [ //Definición independiente del Objeto en Cuestíon
         {
         key: '',//Nombre del Key en el Objeto
         label: '',//Nombre de la variable a mostrar
         type: 'field' //field only value, multiple value
         },
         {
         key: '',//Nombre del Key en el Objeto
         label: '',//Nombre de la variable a mostrar
         type: 'field' //field only value stringify, multiple value stringify, file archivo URL, image imagen
         }
         ]
         }];
         */

        function closeDialog() {

            $mdDialog.cancel();
        }
    }


})();
