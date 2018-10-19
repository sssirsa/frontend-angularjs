(function () {
    angular
        .module('app.mainApp.entries.warranty')
        .controller('warrantyManualEntryController', WarrantyManualEntryController);
    function WarrantyManualEntryController(
        MANUAL_ENTRIES,
        User,
        Translate,
        toastr,
        ErrorHandler,
        $mdDialog
    ) {
        var vm = this;

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab = 0;
        vm.entry = {};
        vm.showSubsidiarySelector = false;
        vm.catalogues = {};
        vm.cabinetList = [];

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
            vm.entry = MANUAL_ENTRIES.warrantyEntry.template;
            vm.catalogues = MANUAL_ENTRIES.warrantyEntry.catalogues();
            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
            }
        })();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.entry[field] = element;
        }

        vm.selectDriverID = function selectDriverID(files) {
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
            else {
                delete (vm.entry['ife_chofer']);
            }
        }

        vm.searchCabinet = function searchCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList.map(function (element) {
                    return element.id;
                }).indexOf(cabinetID);
                if (index !== -1) {
                    //Cabinet already in list
                    toastr.warning(Translate.translate('ENTRIES.WARRANTY.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_ENTRIES
                            .getCabinet(cabinetID),
                        cabinet: null,
                        id: null
                    };

                    //Adding element to the list
                    cabinetToAdd.id = cabinetID;
                    vm.cabinetList.unshift(cabinetToAdd);

                    //Cleaning the search bar
                    vm.cabinetID = '';

                    //Searching for cabinet in the API
                    cabinetToAdd
                        .promise
                        .then(function (successCallback) {
                            if (successCallback.sucursal) {
                                //Cabinet can´t enter because it already has a subsidiary assigned
                                toastr.error(Translate.translate('ENTRIES.WARRANTY.ERRORS.CANT_ENTER'), cabinetID);
                                vm.removeCabinet(cabinetID);
                            }
                            else {
                                //Cabinet can enter
                                cabinetToAdd.cabinet = successCallback;
                            }
                        });
                }
            }
        }

        vm.removeCabinet = function removeCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList
                    .map(function (element) {
                        return element.id;
                    }).indexOf(cabinetID);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('ENTRIES.WARRANTY.ERRORS.NOT_FOUND_ID'), cabinetID);
                }
                else {
                    vm.cabinetList.splice(index, 1);
                }
            }
        }

        vm.clickSaveEntry = function clickSaveEntry(entry) {
            //Show warning message if the entry has unregistered cabinets
            if (entryHasPendingCabinets()) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.translate('MAIN.MSG.WARNING_TITLE'))
                    .textContent(Translate.translate('ENTRIES.WARRANTY.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('ENTRIES.WARRANTY.MESSAGES.PENDING_CABINETS'))
                    .ok(Translate.translate('MAIN.BUTTONS.ACCEPT'))
                    .cancel(Translate.translate('MAIN.BUTTONS.CANCEL'));

                $mdDialog.show(confirm)
                    .then(function () {
                        saveEntry(entry);
                    });
            }
            else {
                saveEntry(entry);
            }
        }

        //Internal functions

        saveEntry = function saveEntry(entry) {
            entry = addCabinetsToEntry(vm.cabinetList, entry);
            //API callback
            vm.createEntryPromise = MANUAL_ENTRIES
                .createWarranty(entry)
                .then(function () {
                    init();
                    toastr.success(
                        Translate.translate('ENTRIES.WARRANTY.MESSAGES.SUCCESS_CREATE')
                    );
                })
                .catch(function (errorCallback) {
                    ErrorHandler.errorTranslate(errorCallback);
                });
        }

        entryHasPendingCabinets = function entryHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        }

        addCabinetsToEntry = function addCabinetsToEntry(cabinets, entry) {
            //In case the cabinets array exist, restart it
            if (entry.cabinets.length) {
                entry.cabinets = [];
            }
            var existingCabinets = cabinets
                .filter(function (element) {
                    //Filtering to just add the cabinets that exist
                    return element.cabinet;
                });
            for (
                let i = 0;
                i < existingCabinets.length;
                i++) {
                entry['cabinets'].push(existingCabinets[i].id);
            }
            return entry;
        }

        //Tab functions

        vm.previousTab = function () {
            vm.selectedTab = vm.selectedTab - 1;
        }

        vm.nextTab = function () {
            vm.selectedTab = vm.selectedTab + 1;
        }

    }

})();
