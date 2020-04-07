(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('manualChangesController', ManualChangesController);
    function ManualChangesController(
        MANUAL_CHANGES,
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
        vm.change;
        vm.showSelector;
        vm.changeFromAgency;
        vm.changeToStore;
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
            vm.showSelector = false;
            vm.cabinetList = [];
            vm.change = MANUAL_CHANGES.internalChange.template();
            vm.catalogues = MANUAL_CHANGES.internalChange.catalogues();

            var user = User.getUser();
            //Determining whether or not to show the Subsidiary or Agency selector.
            vm.showSelector = !user['sucursal'] && !user['udn'];

            //Bindging user subsidiary or agency to entry if user happens to have one.
            if(user['sucursal']){
                vm.changeFromAgency = false;
                user['sucursal']._id ? vm.change[vm.catalogues['origin_subsidiary'].binding] = user['sucursal']._id : null;
            }
            if(user['udn']){
                vm.changeFromAgency = true;
                user['udn']._id ? vm.change[vm.catalogues['origin_agency'].binding] = user['udn']._id : null;
            }

            if (vm.change[vm.catalogues['origin_subsidiary'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary;
                vm.catalogues['transport_line'].catalog.query_value = vm.change[vm.catalogues['origin_subsidiary'].binding];
            }
            if (vm.change[vm.catalogues['origin_agency'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency;
                vm.catalogues['transport_line'].catalog.query_value = vm.change[vm.catalogues['origin_agency'].binding];
            }

        };

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.change[field] = element;
        };

        vm.onOriginSelect = function onOriginSelect(element, field) {
            vm.selectedTab = 0;
            vm.cabinetList = [];
            vm.change = MANUAL_CHANGES.internalChange.template();

            vm.onElementSelect(element, field);
            if (vm.change[vm.catalogues['origin_subsidiary'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary;
                vm.catalogues['transport_line'].catalog.query_value = vm.change[vm.catalogues['origin_subsidiary'].binding];
            }
            if (vm.change[vm.catalogues['origin_agency'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency;
                vm.catalogues['transport_line'].catalog.query_value = vm.change[vm.catalogues['origin_agency'].binding];
            }
        };

        vm.onTransportLineSelect = function (element, field) {
            vm.catalogues['transport_driver'].catalog['query_value'] = element;
            vm.catalogues['transport_kind'].catalog['query_value'] = element;
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
                    vm.change['ife_chofer'] = base64Image;
                };

            }
            else {
                delete (vm.change['ife_chofer']);
            }
        };

        vm.searchCabinet = function searchCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList.map(function (element) {
                    return element.id;
                }).indexOf(cabinetID);
                if (index !== -1) {
                    //Cabinet already in list
                    toastr.warning(Translate.translate('CHANGES.CREATE.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_CHANGES
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
                                        === vm.change[vm.catalogues['origin_subsidiary'].binding]
                                        : false)
                                    || (cabinetSuccessCallback['agency']
                                        ? cabinetSuccessCallback['agency']._id
                                        === vm.change[vm.catalogues['origin_agency'].binding]
                                        : false)
                                ) {
                                    //The subsidiary or agency of the asset is the same as change's
                                    if (cabinetSuccessCallback['can_leave']) {
                                        //The cabinet doesn't have internal restrictions to leave
                                        //if (cabinetSuccessCallback['inspection'].estado === 'Confirmado') {
                                        //Cabinet entry has been confirmed
                                        // if (!cabinetSuccessCallback['cabinet'].nuevo) {
                                        // if (cabinetSuccessCallback['status'] ? cabinetSuccessCallback['status'].code === '0001' : false) {
                                        //Finally add the cabinet to the list
                                        cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                        cabinetToAdd.can_leave = cabinetSuccessCallback.can_leave;
                                        cabinetToAdd.restriction = cabinetSuccessCallback.restriction;
                                        // }
                                        // else {
                                        //     //Building error message
                                        //     var statusMessage =
                                        //         Translate.translate('CHANGES.CREATE.ERRORS.WRONG_STATUS');
                                        //     //Just add status info if available
                                        //     cabinetSuccessCallback['status'] ? statusMessage = statusMessage
                                        //         + ', ' + Translate.translate('CHANGES.CREATE.ERRORS.STATUS_IS')
                                        //         + ': ' + cabinetSuccessCallback['status'].code
                                        //         + '-' + cabinetSuccessCallback['status'].descripcion
                                        //         : null;

                                        //     toastr.error(statusMessage, cabinetSuccessCallback.cabinet.economico);
                                        //     vm.removeCabinet(cabinetID);
                                        // }
                                        // }
                                        // else {
                                        //     toastr.error(
                                        //         Translate.translate('CHANGES.CREATE.ERRORS.IS_NEW')
                                        //         , cabinetSuccessCallback.cabinet.economico
                                        //     );
                                        //     vm.removeCabinet(cabinetID);
                                        // }
                                        //}
                                        // else {
                                        //     toastr.error(Translate.translate('CHANGES.CREATE.ERRORS.NOT_CONFIRMED'), cabinetSuccessCallback.cabinet.economico);
                                        //     vm.removeCabinet(cabinetID);
                                        // }
                                    }
                                    else {
                                        toastr.error(Translate.translate('CHANGES.CREATE.ERRORS.CANT_LEAVE'), cabinetSuccessCallback.cabinet.economico);
                                        //TODO: Add them and show the restriction
                                        vm.removeCabinet(cabinetID);
                                    }

                                }
                                else {
                                    //Just reachable when the user had seleced a subsidiary through the selector.
                                    var locationMessage = Translate.translate('CHANGES.CREATE.ERRORS.NOT_YOUR_SUBSIDIARY');
                                    if (cabinetSuccessCallback['subsidiary']) {
                                        locationMessage = locationMessage
                                            + ', '
                                            + Translate.translate('CHANGES.CREATE.ERRORS.IS_AT')
                                            + ' '
                                            + cabinetSuccessCallback['subsidiary'].nombre;
                                    }
                                    if (cabinetSuccessCallback['agency']) {
                                        locationMessage = locationMessage
                                            + ', '
                                            + Translate.translate('CHANGES.CREATE.ERRORS.IS_AT')
                                            + ' '
                                            + cabinetSuccessCallback['agency'].agencia;
                                    }
                                    toastr.error(locationMessage, cabinetSuccessCallback.cabinet.economico);
                                    vm.removeCabinet(cabinetID);
                                }
                            }
                            else {
                                toastr.error(Translate.translate('CHANGES.CREATE.ERRORS.NOT_IN_SUBSIDIARY'), cabinetSuccessCallback.cabinet.economico);
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
                    toastr.warning(Translate.translate('CHANGES.CREATE.ERRORS.NOT_FOUND_ID'), cabinetID);
                }
                else {
                    vm.cabinetList.splice(index, 1);
                }
            }
        };

        vm.clickSaveChange = function clickSaveChange(change) {
            //Show warning message if the change has unregistered cabinets
            if (changeHasPendingCabinets()) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.translate('MAIN.MSG.WARNING_TITLE'))
                    .textContent(Translate.translate('CHANGES.CREATE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('CHANGES.CREATE.MESSAGES.PENDING_CABINETS'))
                    .ok(Translate.translate('MAIN.BUTTONS.ACCEPT'))
                    .cancel(Translate.translate('MAIN.BUTTONS.CANCEL'));

                $mdDialog.show(confirm)
                    .then(function () {
                        saveChange(change);
                    });
            }
            else {
                saveChange(change);
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

        vm.changeSwitch = function changeSwitch() {
            //Removing mutual excluding variables when the switch is changed
            delete (vm.change[vm.catalogues['origin_agency'].binding]);
            delete (vm.change[vm.catalogues['origin_subsidiary'].binding]);
            vm.change['cabinets'] = [];
            vm.cabinetList = [];
            vm.changeDestinationSwitch();
        };

        vm.changeDriverSwitch = function () {
            //Removing excluding variables when the switch is changed
            delete (vm.change[vm.catalogues['transport_driver'].binding]);
            delete (vm.change[vm.catalogues['transport_line'].binding]);
            delete (vm.change['nombre_chofer']);
        };

        vm.changeDestinationSwitch = function changeDestinationSwitch() {
            //Removing mutual excluding variables when the switch is changed
            delete (vm.change[vm.catalogues['destination_udn'].binding]);
            delete (vm.change[vm.catalogues['destination_subsidiary'].binding]);
        };
        //Internal functions

        var saveChange = function saveChange(change) {
            change = addCabinetsToChange(vm.cabinetList, change);
            change = Helper.removeBlankStrings(change);
            //API callback
            vm.createChangePromise = MANUAL_CHANGES
                .createChange(change)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('CHANGES.CREATE.MESSAGES.SUCCESS_CREATE')
                    );
                })
                .catch(function (errorCallback) {
                    ErrorHandler.errorTranslate(errorCallback);
                });
        };

        var changeHasPendingCabinets = function changeHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        };

        var addCabinetsToChange = function addCabinetsToChange(cabinets, change) {
            //In case the cabinets array exist, restart it
            if (change.cabinets.length) {
                change.cabinets = [];
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
                change['cabinets'].push(existingCabinets[i].id);
            }
            return change;
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