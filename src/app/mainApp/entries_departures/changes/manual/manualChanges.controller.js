/*
    Fields for Changes:
    change:{
        descripcion: string, (Optional)
        tipo_transporte: string(id), 
        operador_transporte: string(id)

        //Next 2 fields required if change is from subsidiary to subsidiary
        sucursal_destino: string(id), (Required if !User.sucursal && !User.udn)
        sucursal_origen: string(id), (Required if manual change)

        //Next 2 fields required if change is from agency to agency
        udn_destino: string(id),
        udn_origen: string(id),

        cabinets: array[id] (Required, not empty, validated)
    }
*/
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
        Helper
    ) {
        var vm = this;

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab;
        vm.change;
        vm.catalogues;
        vm.cabinetList;
        vm.changeFromAgency;
        vm.showSelector;

        vm.user = User.getUser();

        vm.canView = true;

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
        function init() {
            vm.selectedTab = 0;
            vm.showSelector=false;
            vm.catalogues = MANUAL_CHANGES.internalChange;

            vm.cabinetList = [];
            //Determining whether or not to show the Subsidiary or Agency selector.
            vm.showSelector = !vm.user['sucursal'] && !vm.user['udn'];

            //Bindging user subsidiary or agency to change if user happens to have one.
            vm.user['sucursal'] ? vm.change[vm.catalogues['origin_subsidiary'].binding] = vm.user['sucursal'].id : null;
            vm.user['udn'] ? vm.change[vm.catalogues['origin_udn'].binding] = vm.user['udn'].id : null;

            if (vm.showSelector) {
                //Initializing as Subsidiary change when the user has no origin                
                vm.change = MANUAL_CHANGES.subsidiaryChange.template();
                vm.catalogues = MANUAL_CHANGES.subsidiaryChange.catalogues();
            }
            else {
                if (vm.user.udn) {
                    //The user is from an agency
                    vm.change = MANUAL_CHANGES.agencyChange.template();
                    vm.catalogues = MANUAL_CHANGES.agencyChange.catalogues();
                }
                if (vm.user.sucursal) {
                    //The user is from a subsidiary
                    vm.change = MANUAL_CHANGES.subsidiaryChange.template();
                    vm.catalogues = MANUAL_CHANGES.subsidiaryChange.catalogues();
                }
            }
        }
        init();


        //Controller global functions
        vm.onElementSelect = function onElementSelect(element, field) {
            vm.change[field] = element;
        };

        vm.onOriginSelect = function onOriginSelect(element, field) {
            vm.selectedTab = 0;
            vm.cabinetList = [];

            vm.onElementSelect(element, field);
        };

        vm.changeSwitch = function changeSwitch() {
            //Removing mutual excluding variables when the switch is changed
            //delete (vm.change[vm.catalogues['origin_udn'].binding]);
            //delete (vm.change[vm.catalogues['origin_subsidiary'].binding]);

            vm.change['cabinets_id'] = [];
            vm.cabinetList = [];
            if (vm.changeFromAgency) {
                //The user selected the change is from an agency
                vm.change = MANUAL_CHANGES.agencyChange.template();
                vm.change = MANUAL_CHANGES.agencyChange.template();
                vm.catalogues = MANUAL_CHANGES.agencyChange.catalogues();
            }
            else {
                //The user selected the change is from a subsidiary
                vm.change = MANUAL_CHANGES.subsidiaryChange.template();
                vm.change = MANUAL_CHANGES.subsidiaryChange.template();
                vm.catalogues = MANUAL_CHANGES.subsidiaryChange.catalogues();
            }
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
                    var subsidiary, agency;
                    vm.catalogues['origin_subsidiary'] ? subsidiary = vm.catalogues['origin_subsidiary'] : subsidiary = null;
                    vm.catalogues['origin_udn'] ? agency = vm.catalogues['origin_udn'] : agency = null;
                    var cabinetToAdd = {
                        promise: MANUAL_CHANGES
                            .getCabinet(cabinetID,
                                vm.change[subsidiary],
                                vm.change[agency]
                            ),
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
                            if (cabinetSuccessCallback['subsidiary']
                                || cabinetSuccessCallback['agency']) {
                                if (cabinetSuccessCallback['can_leave']) {
                                    //The cabinet doesn't have internal restrictions to leave
                                    //a.k.a. The cabinet exists in the selected subsidiary or agency
                                    if (
                                        (cabinetSuccessCallback['subsidiary']
                                            ? cabinetSuccessCallback['subsidiary'].id
                                            === vm.change[vm.catalogues['origin_subsidiary'].binding]
                                            : false)
                                        || (cabinetSuccessCallback['agency']
                                            ? cabinetSuccessCallback['agency'].id
                                            === vm.change[vm.catalogues['origin_udn'].binding]
                                            : false)
                                    ) {
                                        //The subsidiary or agency of the asset is the same as change's
                                        if (cabinetSuccessCallback['can_leave']) {
                                            //The cabinet doesn't have internal restrictions to leave
                                            if (cabinetSuccessCallback['inspection'].estado === 'Confirmado') {
                                                //Cabinet change has been confirmed
                                                cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                                cabinetToAdd.can_leave = cabinetSuccessCallback.can_leave;
                                                cabinetToAdd.restriction = cabinetSuccessCallback.restriction;
                                            }
                                            else {
                                                toastr.error(Translate.translate('CHANGES.CREATE.ERRORS.NOT_CONFIRMED'), cabinetSuccessCallback.cabinet.economico);
                                                vm.removeCabinet(cabinetID);
                                            }
                                        }
                                        else {
                                            toastr.error(Translate.translate('CHANGES.CREATE.ERRORS.NOT_CONFIRMED'), cabinetSuccessCallback.cabinet.economico);
                                            vm.removeCabinet(cabinetID);
                                        }
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
                        .catch(function setCabinetToAddError(error) {
                            ErrorHandler.errorTranslate(error);
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

        //Internal functions

        var saveChange = function saveChange(change) {
            change = addCabinetsToChange(vm.cabinetList, change);
            change = Helper.removeBlankStrings(change);
            //API callback
            if (vm.changeFromAgency || vm.user['udn']) {
                vm.createChangePromise = MANUAL_CHANGES
                    .createAgency(change)
                    .then(function () {
                        init();
                        toastr.success(
                            Translate.translate('CHANGES.CREATE.MESSAGES.SUCCESS_CREATE')
                        );
                    })
                    .catch(function (errorCallback) {
                        ErrorHandler.errorTranslate(errorCallback);
                    });
            }
            else{
                vm.createChangePromise = MANUAL_CHANGES
                    .createSubsidiary(change)
                    .then(function () {
                        init();
                        toastr.success(
                            Translate.translate('CHANGES.CREATE.MESSAGES.SUCCESS_CREATE')
                        );
                    })
                    .catch(function (errorCallback) {
                        ErrorHandler.errorTranslate(errorCallback);
                    });
            }
        };

        var changeHasPendingCabinets = function changeHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        };

        var addCabinetsToChange = function addCabinetsToChange(cabinets, change) {
            //In case the cabinets array exist, restart it
            if (change.cabinets_id.length) {
                change.cabinets_id = [];
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
                change['cabinets_id'].push(existingCabinets[i].id);
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
