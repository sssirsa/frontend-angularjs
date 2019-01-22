/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('showInfoCabinetDialogController', showInfoCabinetDialogController);

    function showInfoCabinetDialogController(cabinet) {
        var vm = this;
        show();
        function show() {
            console.log(cabinet);
            vm.asset=cabinet;

        }

    }


})();
