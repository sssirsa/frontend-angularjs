/**
 * Created by franciscojaviercerdamartinez on 8/13/19.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('createMassiveLoadController', createMassiveLoadController);

    function createMassiveLoadController($mdDialog,  ErrorHandler, MassiveLoadProvider) {
        var vm = this;

        //variables
        vm.infoMassiveLoad;

        //funciones
        vm.cerrar = cerrar;
        vm.clean = clean;

        init();

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function init() {
            listMassiveLoadsType();
        }
        function listMassiveLoadsType() {
            vm.promiseMassiveLoadTypeList = MassiveLoadProvider.getMassiveLoadType()
                .then(function (listType) {
                    vm.massive_charge_kind = listType.results;
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
        }

        function clean() {
            vm.infoMassiveLoad = null;
        }

    }

})();
