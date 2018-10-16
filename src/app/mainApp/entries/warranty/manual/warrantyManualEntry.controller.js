(function () {
    angular
        .module('app.mainApp.entries.warranty')
        .controller('warrantyManualEntryController', WarrantyManualEntryController);
    function WarrantyManualEntryController(
        MANUAL_ENTRIES,
        User,
        URLS
    ) {
        var vm = this;

        //Variables
        vm.entry = {};
        vm.showSubsidiarySelector = false;
        vm.catalogues = {};

        // Auto invoked init function
        (function init() {
            vm.entry = MANUAL_ENTRIES.warrantyEntry.template();
            vm.catalogues = MANUAL_ENTRIES.warrantyEntry.catalogues();
            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
            }
        })();

        //Controller functions

        vm.onElementSelect = function (element, field) {
            vm.entry[field] = element;
        }

    }

})();
