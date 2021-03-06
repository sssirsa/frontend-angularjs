(function () {
    angular
        .module('app.mainApp.entries_departures.departures.new')
        .controller('newManualDepartureController', NewManualDepartureController);
    function NewManualDepartureController(
        MANUAL_DEPARTURES,
        User,
        Translate,
        toastr,
        ErrorHandler,
        $mdDialog,
        Helper,
        QUERIES
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

        vm.canView = true;

        vm.user = User.getUser();

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
            vm.departure = MANUAL_DEPARTURES.newDeparture.template();
            vm.catalogues = MANUAL_DEPARTURES.newDeparture.catalogues();
            //Determining whether or not to show the Subsidiary selector.
            vm.showSubsidiarySelector = !vm.user['sucursal'];
            vm.user['sucursal'] ? vm.departure[vm.catalogues['subsidiary'].binding] = vm.user['sucursal']._id : null;
            vm.user['udn'] ? vm.departure[vm.catalogues['udn'].binding] = vm.user['udn']._id : null;
            
            if (vm.departure[vm.catalogues['subsidiary'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary;
                vm.catalogues['transport_line'].catalog.query_value = vm.departure[vm.catalogues['subsidiary'].binding];
            }
            if (vm.departure[vm.catalogues['udn'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency;
                vm.catalogues['transport_line'].catalog.query_value = vm.departure[vm.catalogues['udn'].binding];
            }
        };

        //Just load if user is not from an Agency
        vm.user['udn'] ? vm.canView = false : vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.departure[field] = element;
        };

        vm.onSubsidiarySelect = function onSubsidiarySelect(element, field) {
            vm.selectedTab = 0;
            vm.cabinetList = [];
            //Cloning clean departure object
            vm.departure = angular.fromJson(
                angular.toJson(
                    MANUAL_DEPARTURES.newDeparture.template()
                )
            );

            vm.onElementSelect(element, field);
            
            if (vm.departure[vm.catalogues['subsidiary'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary;
                vm.catalogues['transport_line'].catalog.query_value = vm.departure[vm.catalogues['subsidiary'].binding];
            }
            if (vm.departure[vm.catalogues['udn'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency;
                vm.catalogues['transport_line'].catalog.query_value = vm.departure[vm.catalogues['udn'].binding];
            }
        };        

        vm.onTransportLineSelect = function (element, field) {
            vm.catalogues['transport_driver'].catalog['query_value'] = element;
            vm.catalogues['transport_kind'].catalog['query_value'] = element;
            vm.onElementSelect(element, field);
        };
        
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
                            if (cabinetSuccessCallback['subsidiary']
                                || cabinetSuccessCallback['agency']) {
                                //a.k.a. The cabinet exists in any subsidiary or agency
                                if (
                                    (cabinetSuccessCallback['subsidiary']
                                        ? cabinetSuccessCallback['subsidiary']._id
                                        === vm.departure[vm.catalogues['subsidiary'].binding]
                                        : false)
                                    || (cabinetSuccessCallback['agency']
                                        ? cabinetSuccessCallback['agency']._id
                                        === vm.departure[vm.catalogues['udn'].binding]
                                        : false)
                                ) {
                                    //The subsidiary or agency of the asset is the same as departure's
                                    //if (cabinetSuccessCallback['entrance_kind'] === vm.departure['tipo_salida']) {
                                    //The departure matches the entrance kind
                                    if (cabinetSuccessCallback['cabinet'].nuevo) {
                                        if (cabinetSuccessCallback['can_leave']) {
                                            //The cabinet doesn't have internal restrictions to leave
                                            // if (cabinetSuccessCallback['inspection'].estado === 'Confirmado') {
                                            //Cabinet entry has been confirmed

                                            //Finally add the cabinet to the list
                                            cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                            cabinetToAdd.can_leave = cabinetSuccessCallback.can_leave;
                                            cabinetToAdd.restriction = cabinetSuccessCallback.restriction;
                                            // }
                                            // else {
                                            //     toastr.error(Translate.translate('DEPARTURES.NEW.ERRORS.NOT_CONFIRMED'), cabinetSuccessCallback.cabinet.economico);
                                            //     vm.removeCabinet(cabinetID);
                                            // }
                                        }
                                        else {
                                            toastr.error(Translate.translate('DEPARTURES.NEW.ERRORS.CANT_LEAVE'), cabinetSuccessCallback.cabinet.economico);
                                            vm.removeCabinet(cabinetID);
                                        }
                                    }
                                    else {
                                        toastr.error(
                                            Translate.translate('DEPARTURES.NEW.ERRORS.WRONG_DEPARTURE_KIND')
                                            , cabinetSuccessCallback.cabinet.economico
                                        );
                                        vm.removeCabinet(cabinetID);
                                    }
                                    //}
                                    // else {
                                    //     toastr.error(
                                    //         Translate.translate('DEPARTURES.NEW.ERRORS.WRONG_DEPARTURE_KIND')
                                    //         , cabinetSuccessCallback.cabinet.economico
                                    //     );
                                    //     vm.removeCabinet(cabinetID);
                                    // }
                                }
                                else {
                                    //Just reachable when the user had seleced a subsidiary through the selector. 
                                    var message = Translate.translate('DEPARTURES.NEW.ERRORS.NOT_YOUR_SUBSIDIARY');
                                    if (cabinetSuccessCallback['subsidiary']) {
                                        message = message
                                            + ', '
                                            + Translate.translate('DEPARTURES.NEW.ERRORS.IS_AT')
                                            + ' '
                                            + cabinetSuccessCallback['subsidiary'].nombre;
                                    }
                                    if (cabinetSuccessCallback['agency']) {
                                        message = message
                                            + ', '
                                            + Translate.translate('DEPARTURES.NEW.ERRORS.IS_AT')
                                            + ' '
                                            + cabinetSuccessCallback['agency'].agencia;
                                    }
                                    toastr.error(message, cabinetSuccessCallback.cabinet.economico);
                                    vm.removeCabinet(cabinetID);
                                }
                            }
                            else {
                                toastr.error(
                                    Translate.translate('DEPARTURES.NEW.ERRORS.NOT_IN_SUBSIDIARY')
                                    , cabinetSuccessCallback.cabinet.economico
                                );
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
                    toastr.warning(Translate.translate('DEPARTURES.NEW.ERRORS.NOT_FOUND_ID'), cabinetID);
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

        vm.changeDriverSwitch = function () {
            //Removing excluding variables when the switch is changed
            delete (vm.departure[vm.catalogues['transport_driver'].binding]);
            delete (vm.departure[vm.catalogues['transport_line'].binding]);
            if (vm.departure['nombre_chofer']) {
                delete (vm.departure['nombre_chofer']);
            }
        };

        //Internal functions

        var saveDeparture = function saveDeparture(departure) {
            departure = addCabinetsToDeparture(vm.cabinetList, departure);
            departure = Helper.removeBlankStrings(departure);
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
            if (departure.cabinets.length) {
                departure.cabinets = [];
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
                departure['cabinets'].push(existingCabinets[i].id);
            }
            return departure;
        };

        //Tab functions

        vm.previousTab = function () {
            vm.selectedTab = vm.selectedTab - 1;
        };

        vm.nextTab = function () {
            vm.selectedTab = vm.selectedTab + 1;
        };

    }

})();
