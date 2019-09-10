(function () {
    angular
        .module('app.mainApp.entries_departures')
        .controller('addCabinetToEntryDialogController', AddCabinetToEntryDialogController);
    function AddCabinetToEntryDialogController(
        $mdDialog,
        OPTIONS,
        unrecognizable //Boolean
    ) {
        var vm = this;

        //Globals
        vm.cabinetToAdd;
        vm.unrecognizable = unrecognizable;

        //Constants
        vm.cabinetStatuses = OPTIONS.entries_departures.entries.addCabinetKind;

        //Functions
        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.addAsset = function () {
            $mdDialog.hide(vm.cabinetToAdd);
        };

    }
})();
