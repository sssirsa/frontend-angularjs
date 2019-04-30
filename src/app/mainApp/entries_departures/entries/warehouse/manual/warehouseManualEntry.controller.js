(function () {
    angular
        .module('app.mainApp.entries_departures.entries.warehouse')
        .controller('warehouseManualEntryController', WarehouseManualEntryController);
    function WarehouseManualEntryController(
        MANUAL_ENTRIES,
        User,
        Translate,
        toastr,
        ErrorHandler,
        $mdDialog,
        Helper
    ) {
        var vm = this;

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab;
        vm.entry;
        vm.showSubsidiarySelector;
        vm.catalogues;
        vm.cabinetList;

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
        vm.init = function init() {
            vm.selectedTab = 0;
            vm.showSubsidiarySelector = false;
            vm.catalogues = {};
            vm.cabinetList = [];
            vm.entry = MANUAL_ENTRIES.warehouseEntry.template();
            vm.catalogues = MANUAL_ENTRIES.warehouseEntry.catalogues();

            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
            }
        }

        vm.init();

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
                    //Cleaning the search bar
                    vm.cabinetID = '';
                    //Cabinet already in list
                    toastr.warning(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_ENTRIES
                            .getCabinet(cabinetID),
                        cabinet: null,
                        obsolete: false,
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
                        .then(function setCabinetToAddSuccess(cabinetSuccessCallback) {
                            if (cabinetSuccessCallback.can_enter) {
                                //Cabinet can enter
                                cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                            }
                            else {
                                //Cabinet can´t enter because it already has a subsidiary assigned
                                toastr.error(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.CANT_ENTER'), cabinetID);
                                vm.removeCabinet(cabinetID);
                            }
                        })
                        .catch(function setCabinetToAddError(error) {
                            //Cleaning the search bar
                            vm.cabinetID = '';
                            ErrorHandler.errorTranslate(error);
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
                    toastr.warning(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.NOT_FOUND_ID'), cabinetID);
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
                    .textContent(Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.PENDING_CABINETS'))
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

        vm.createCabinet = function createCabinet(cabinetID) {
            $mdDialog.show({
                controller: 'CabinetDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/inventory/managementCabinet/dialogs/create/cabinetCreateDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    cabinetID: cabinetID
                }
            }).then(function (successCallback) {
                var cabinetID = successCallback.economico;
                vm.removeCabinet(cabinetID);
                vm.searchCabinet(cabinetID);
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errorTranslate(err);
                }
            });
        }

        //Internal functions

        saveEntry = function saveEntry(entry) {
            var warehouseEntry = JSON.parse(JSON.stringify(entry));
            warehouseEntry = addCabinetsToEntry(vm.cabinetList, warehouseEntry, false);
            warehouseEntry = Helper.removeBlankStrings(warehouseEntry);

            var obsoleteEntry = JSON.parse(JSON.stringify(entry));
            obsoleteEntry = addCabinetsToEntry(vm.cabinetList, obsoleteEntry, true);
            obsoleteEntry = Helper.removeBlankStrings(obsoleteEntry);

            //API callback
            if (warehouseEntry.cabinets_id.length > 0) {
                vm.createEntryPromise = MANUAL_ENTRIES
                    .createWarehouse(warehouseEntry)
                    .then(function (warehouseEntrySuccessCallback) {
                        console.log(warehouseEntrySuccessCallback);
                        for (var i = 0;
                            i < warehouseEntrySuccessCallback['cabinets'].length;
                            i++) {
                            MANUAL_ENTRIES.createAutomaticInspection(warehouseEntrySuccessCallback['cabinets'][i]);
                        }
                        vm.init();
                        toastr.success(
                            Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.SUCCESS_CREATE_WAREHOUSE')
                        );
                    })
                    .catch(function (errorCallback) {
                        ErrorHandler.errorTranslate(errorCallback);
                    });
            }

            obsoleteEntry.tipo_entrada = 'Obsoletos';

            if (obsoleteEntry.cabinets_id.length > 0) {
                vm.createEntryPromise = MANUAL_ENTRIES
                    .createObsolete(obsoleteEntry)
                    .then(function (obsoleteEntrySuccessCallback) {
                        console.log(obsoleteEntrySuccessCallback);
                        for (var i = 0;
                            i < obsoleteEntrySuccessCallback['cabinets'].length;
                            i++) {
                            MANUAL_ENTRIES.createAutomaticInspection(obsoleteEntrySuccessCallback['cabinets'][i]);
                        }
                        vm.init();
                        toastr.success(
                            Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.SUCCESS_CREATE_SCRAPPED')
                        );
                    })
                    .catch(function (errorCallback) {
                        ErrorHandler.errorTranslate(errorCallback);
                    });
            }
        }

        entryHasPendingCabinets = function entryHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        }

        addCabinetsToEntry = function addCabinetsToEntry(cabinets, entry, obsolete) {
            //In case the cabinets array exist, restart it
            if (entry.cabinets_id.length) {
                entry.cabinets_id = [];
            }
            var existingCabinets = cabinets
                .filter(function (element) {
                    //Filtering to just add the cabinets that exist and have the obsolete flag
                    if (element.obsolete == obsolete) {
                        return element.cabinet;
                    }
                });
            for (
                var i = 0;
                i < existingCabinets.length;
                i++) {
                entry['cabinets_id'].push(existingCabinets[i].id);
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
