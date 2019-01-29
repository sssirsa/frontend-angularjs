//Create by Alex 28/01/2019

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('impedimentDetailController',impedimentDetailController);

    function impedimentDetailController(cabinetUC, $mdDialog, data, $scope, Translate, ErrorHandler)
    {
        var vm = this;

        //variables
        vm.infoImpediment = {};
        vm.loadingPromise = null;

        //Translates
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');

        //funciones
        vm.cerrar = cerrar;

        init();

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function init() {
            vm.loadingPromise = cabinetUC.getImpediment(data)
                .then(function impediment(info) {
                    info.date_impedimento = info.fecha_aislamiento.substr(0, 10);
                    vm.infoImpediment = info;
                })
                .catch(function (err) {
                    ErrorHandler.errorTranslate(err);
                    $mdDialog.hide(err);
                });
        }

    }

})();
