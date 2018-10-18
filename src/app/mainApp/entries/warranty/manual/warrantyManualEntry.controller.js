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

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab = 0;
        vm.entry = {};
        vm.showSubsidiarySelector = false;
        vm.catalogues = {};

        //Validations
        vm.imageConstraints = {
            validations: {
                size: {
                    max: '5MB',
                    min: '10B',
                    height: { max: 4096, min: 100 },
                    width: { max: 4096, min: 100 }
                }
            },
            resize: { width: 4096 },
            resizeIf: '$width > 4096 || $height > 4096'
        };

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

        vm.selectDriverID = function (files) {
            if (files.length > 0) {
                var file = files[0];
                //Image processing as a base64 string
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.entry['ife_chofer'] = base64Image;
                };

            }
        }

        vm.saveEntry = function (entry) {

        }

        //Tab functions

        vm.previousTab = function () {
            console.log(vm.selectedTab);
            vm.selectedTab = vm.selectedTab - 1;
            console.log(vm.selectedTab);
        }

        vm.nextTab = function () {
            console.log(vm.selectedTab);
            vm.selectedTab = vm.selectedTab + 1;
            console.log(vm.selectedTab);
        }

    }

})();
