(function () {
    angular
        .module('app.mainApp.entries.obsolete')
        .controller('obsoleteManualEntryController', ObsoleteManualEntryController);
    function ObsoleteManualEntryController(
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
            vm.entry = MANUAL_ENTRIES.obsoleteEntry.template();
            vm.catalogues = MANUAL_ENTRIES.obsoleteEntry.catalogues();

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
                    //Cabinet already in list
                    toastr.warning(Translate.translate('ENTRIES.OBSOLETE.ERRORS.REPEATED_ID'), cabinetID);
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
                        .then(function setCabinetToAddSuccess(cabinetSuccessCallback) {
                            if (cabinetSuccessCallback.can_enter) {
                                //Cabinet can enter
                                cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                            }
                            else {
                                //Cabinet can´t enter because it already has a subsidiary assigned
                                toastr.error(Translate.translate('ENTRIES.OBSOLETE.ERRORS.CANT_ENTER'), cabinetID);
                                vm.removeCabinet(cabinetID);
                            }
                        })
                        .catch(function setCabinetToAddError(error) {
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
                    toastr.warning(Translate.translate('ENTRIES.OBSOLETE.ERRORS.NOT_FOUND_ID'), cabinetID);
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
                    .textContent(Translate.translate('ENTRIES.OBSOLETE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('ENTRIES.OBSOLETE.MESSAGES.PENDING_CABINETS'))
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
            entry = addCabinetsToEntry(vm.cabinetList, entry);
            entry = Helper.removeBlankStrings(entry);
            //API callback
            vm.createEntryPromise = MANUAL_ENTRIES
                .createObsolete(entry)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('ENTRIES.OBSOLETE.MESSAGES.SUCCESS_CREATE')
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
            if (entry.cabinets_id.length) {
                entry.cabinets_id = [];
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
