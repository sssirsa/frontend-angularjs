(function () {
    angular
        .module('app.mainApp.entries_departures.departures.obsolete')
        .controller('obsoleteManualDepartureController', ObsoleteManualDepartureController);
    function ObsoleteManualDepartureController(
        MANUAL_DEPARTURES,
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
        vm.departure;
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
            vm.cabinetList = [];
            vm.departure = MANUAL_DEPARTURES.obsoleteDeparture.template();
            vm.catalogues = MANUAL_DEPARTURES.obsoleteDeparture.catalogues();

            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
                vm.departure[vm.catalogues['subsidiary'].binding] = User.getUser().sucursal;
            }
        };

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.departure[field] = element;
        };

        vm.onSubsidiarySelect = function onSubsidiarySelect(element, field) {
            vm.selectedTab = 0;
            vm.cabinetList = [];
            vm.departure = MANUAL_DEPARTURES.obsoleteDeparture.template();

            vm.onElementSelect(element, field);
        };

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
        };

        vm.searchCabinet = function searchCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList.map(function (element) {
                    return element.id;
                }).indexOf(cabinetID);
                if (index !== -1) {
                    //Cabinet already in list
                    toastr.warning(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_DEPARTURES
                            .getCabinet(cabinetID),
                        cabinet: null,
                        id: null,
                        can_leave: null,
                        restriction: null
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
                            if (cabinetSuccessCallback['subsidiary']) {
                                //a.k.a. The cabinet exists in the selected subsidiary
                                if (cabinetSuccessCallback['subsidiary'] == vm.departure[vm.catalogues['subsidiary'].binding]) {
                                    //The subsidiary of the cabinet is the same as the user one.
                                    if (cabinetSuccessCallback['entrance_kind'] == vm.departure['tipo_salida']) {
                                        //The departure matches the entrance kind
                                        if (cabinetSuccessCallback['can_leave']) {
                                            //The cabinet doesn't have internal restrictions to leave

                                            //Finally add the cabinet to the list
                                            cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                            cabinetToAdd.can_leave = cabinetSuccessCallback.can_leave;
                                            cabinetToAdd.restriction = cabinetSuccessCallback.restriction;
                                        }
                                        else {
                                            toastr.error(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.CANT_LEAVE'), cabinetSuccessCallback.cabinet.economico);
                                            vm.removeCabinet(cabinetID);
                                        }
                                    }
                                    else {
                                        toastr.error(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.WRONG_DEPARTURE_KIND'), cabinetSuccessCallback.cabinet.economico);
                                        vm.removeCabinet(cabinetID);
                                    }
                                }
                                else {
                                    //Just reachable when the user had seleced a subsidiary through the selector. 
                                    toastr.error(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.NOT_YOUR_SUBSIDIARY'), cabinetSuccessCallback.cabinet.economico);
                                    vm.removeCabinet(cabinetID);
                                }
                            }
                            else {
                                toastr.error(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.NOT_IN_SUBSIDIARY'), cabinetSuccessCallback.cabinet.economico);
                                vm.removeCabinet(cabinetID);
                            }
                        })
                        .catch(function setCabinetToAddError(cabinetErrorCallback) {
                            ErrorHandler.errorTranslate(cabinetErrorCallback);
                            vm.removeCabinet(cabinetID);
                        });
                }
            }
        };

        vm.removeCabinet = function removeCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList
                    .map(function (element) {
                        return element.id;
                    }).indexOf(cabinetID);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('DEPARTURES.OBSOLETE.ERRORS.NOT_FOUND_ID'), cabinetID);
                }
                else {
                    vm.cabinetList.splice(index, 1);
                }
            }
        };

        vm.clickSaveDeparture = function clickSaveDeparture(departure) {
            //Show warning message if the departure has unregistered cabinets
            if (departureHasPendingCabinets()) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.translate('MAIN.MSG.WARNING_TITLE'))
                    .textContent(Translate.translate('DEPARTURES.OBSOLETE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('DEPARTURES.OBSOLETE.MESSAGES.PENDING_CABINETS'))
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
        };

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
            return cabinetID;
            //TODO: Cabinet restriction dialog
        };

        //Internal functions

        var saveDeparture = function saveDeparture(departure) {
            departure = addCabinetsToDeparture(vm.cabinetList, departure);
            departure = Helper.removeBlankStrings(departure);
            //API callback
            vm.createDeparturePromise = MANUAL_DEPARTURES
                .createObsolete(departure)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('DEPARTURES.OBSOLETE.MESSAGES.SUCCESS_CREATE')
                    );
                })
                .catch(function (errorCallback) {

                    ErrorHandler.errorTranslate(errorCallback);
                });
        };

        var departureHasPendingCabinets = function departureHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        };

        var addCabinetsToDeparture = function addCabinetsToDeparture(cabinets, departure) {
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
                var i = 0;
                i < existingCabinets.length;
                i++) {
                departure['cabinets_id'].push(existingCabinets[i].id);
            }
            return departure;
        };

        //var addCabinetToList = function addCabinetToList(cabinet) {
        //    var cabinetToAdd = {
        //        promise: null,
        //        cabinet: cabinet,
        //        id: cabinet['economico']
        //    };

        //    vm.cabinetList.push(cabinetToAdd);
        //};

        //Tab functions

        vm.previousTab = function () {
            vm.selectedTab = vm.selectedTab - 1;
        };

        vm.nextTab = function () {
            vm.selectedTab = vm.selectedTab + 1;
        };

    }

})();
