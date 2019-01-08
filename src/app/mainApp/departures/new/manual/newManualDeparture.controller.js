(function () {
    angular
        .module('app.mainApp.departures.new')
        .controller('newManualDepartureController', NewManualDepartureController);
    function NewManualDepartureController(
        MANUAL_DEPARTURES,
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
        vm.selectedTab;
        vm.departure;
        vm.showSubsidiarySelector;
        vm.catalogues;
        vm.cabinetList;
        //vm.departureFromAgency; //Determines which catalog to show (Petition or udn)

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
            vm.selectedTab = 0
            vm.showSubsidiarySelector = false;
            vm.cabinetList = [];
            vm.departure = MANUAL_DEPARTURES.newDeparture.template();
            vm.catalogues = MANUAL_DEPARTURES.newDeparture.catalogues();

            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
            }
        }

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.departure[field] = element;
        }

        vm.onSubsidiarySelect = function onSubsidiarySelect(element, field) {
            vm.selectedTab = 0
            vm.cabinetList = [];
            vm.departure = MANUAL_DEPARTURES.newDeparture.template();

            vm.onElementSelect(element, field);
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
                    vm.departure['ife_chofer'] = base64Image;
                };

            }
            else {
                delete (vm.departure['ife_chofer']);
            }
        }

        vm.searchCabinet = function searchCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList.map(function (element) {
                    return element.id;
                }).indexOf(cabinetID);
                if (index !== -1) {
                    //Cabinet already in list
                    toastr.warning(Translate.translate('DEPARTURES.NEW.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_DEPARTURES
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
                            console.log(cabinetSuccessCallback);
                            //Cabinet can enter
                            if (cabinetSuccessCallback.can_enter) {
                                //Cabinet exist in database
                                if (cabinetSuccessCallback.cabinet) {
                                    //Cabinet it's new
                                    if (cabinetSuccessCallback.cabinet.nuevo) {
                                        cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                    }
                                    else {
                                        //Cabinet can´t enter because it's not new
                                        toastr.error(Translate.translate('DEPARTURES.NEW.ERRORS.CANT_ENTER_NOT_NEW'), cabinetID);
                                        vm.removeCabinet(cabinetID);
                                    }
                                }
                                //else {
                                //    //The cabinet is added to be created (you do nothing)
                                //}
                            }
                            else {
                                //Cabinet can't enter because it's in a warehouse
                                toastr.error(Translate.translate('DEPARTURES.NEW.ERRORS.CANT_ENTER_IN_WAREHOUSE'), cabinetID);
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
                    toastr.warning(Translate.translate('DEPARTURES.NEW.ERRORS.NOT_FOUND_ID'), cabinetID);
                }
                else {
                    vm.cabinetList.splice(index, 1);
                }
            }
        }

        vm.clickSaveDeparture = function clickSaveDeparture(departure) {
            //Show warning message if the departure has unregistered cabinets
            if (departureHasPendingCabinets()) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.translate('MAIN.MSG.WARNING_TITLE'))
                    .textContent(Translate.translate('DEPARTURES.NEW.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('DEPARTURES.NEW.MESSAGES.PENDING_CABINETS'))
                    .ok(Translate.translate('MAIN.BUTTONS.ACCEPT'))
                    .cancel(Translate.translate('MAIN.BUTTONS.CANCEL'));

                $mdDialog.show(confirm)
                    .then(function () {
                        saveDeparture(departure);
                    });
            }
            else {
                saveDeparture(departure);
            }
        }

        vm.showCabinetRestriction = function showCabinetRestriction(cabinetID) {
            //$mdDialog.show({
            //    controller: 'CabinetDialogController',
            //    controllerAs: 'vm',
            //    templateUrl: 'app/mainApp/inventory/managementCabinet/dialogs/create/cabinetCreateDialog.tmpl.html',
            //    fullscreen: true,
            //    clickOutsideToClose: true,
            //    focusOnOpen: true,
            //    locals: {
            //        cabinetID: cabinetID
            //    }
            //}).then(function (successCallback) {
            //    var cabinetID = successCallback.economico;
            //    vm.removeCabinet(cabinetID);
            //    addCabinetToList(successCallback);
            //}).catch(function (err) {
            //    if (err) {
            //        ErrorHandler.errorTranslate(err);
            //    }
            //});

            //TODO: Cabinet restriction dialog
        }

        vm.changeSwitch = function changeSwitch() {
            //Removing mutual excluding variables when the switch is changed
            delete (vm.departure[vm.catalogues['udn'].binding]);
            delete (vm.departure[vm.catalogues['petition'].binding]);
        }

        //Internal functions

        saveDeparture = function saveDeparture(departure) {
            departure = addCabinetsToDeparture(vm.cabinetList, departure);
            //API callback
            vm.createDeparturePromise = MANUAL_DEPARTURES
                .createNew(departure)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('DEPARTURES.NEW.MESSAGES.SUCCESS_CREATE')
                    );
                })
                .catch(function (errorCallback) {
                    console.error(errorCallback);
                    ErrorHandler.errorTranslate(errorCallback);
                });
        }

        departureHasPendingCabinets = function departureHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        }

        addCabinetsToDeparture = function addCabinetsToDeparture(cabinets, departure) {
            //In case the cabinets array exist, restart it
            if (departure.cabinets_id.length) {
                departure.cabinets_id = [];
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
                departure['cabinets_id'].push(existingCabinets[i].id);
            }
            return departure;
        }

        addCabinetToList = function addCabinetToList(cabinet) {
            var cabinetToAdd = {
                promise: null,
                cabinet: cabinet,
                id: cabinet['economico']
            };

            vm.cabinetList.push(cabinetToAdd);
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
