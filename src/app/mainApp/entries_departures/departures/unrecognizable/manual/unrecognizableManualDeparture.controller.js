(function () {
    angular
        .module('app.mainApp.entries_departures.departures.unrecognizable')
        .controller('unrecognizableManualDepartureController', UnrecognizableManualDepartureController);
    function UnrecognizableManualDepartureController(
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
        vm.departureFromAgency; //Determines what catalog to show (Petition or udn)

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
            vm.showSubsidiarySelector = false;
            vm.catalogues = {};
            vm.cabinetList = [];
            vm.departureFromAgency = false; //Determines what catalog to show (Petition or udn)
            vm.departure = MANUAL_DEPARTURES.unrecognizableDeparture.template();
            vm.catalogues = MANUAL_DEPARTURES.unrecognizableDeparture.catalogues();
            vm.selectedTab = 0;


            //Determining whether or not to show the Subsidiary selector.
            if (User.getUser().hasOwnProperty('sucursal')) {
                vm.showSubsidiarySelector = !User.getUser().sucursal;
            }
        };

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.departure[field] = element;
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
                    toastr.warning(Translate.translate('DEPARTURES.UNRECOGNIZABLE.ERRORS.REPEATED_ID'), cabinetID);
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
                        .then(function () {
                            //Cabinet is not new
                            //TODO: Validate incidences and subsidiary,
                            //this in case the cabinet got created but
                            //the previously tried entrance got an error.
                            toastr.error(Translate.translate('DEPARTURES.UNRECOGNIZABLE.ERRORS.CANT_ENTER'), cabinetID);
                            vm.removeCabinet(cabinetID);
                        })
                        .catch(function () {

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
                    toastr.warning(Translate.translate('DEPARTURES.UNRECOGNIZABLE.ERRORS.NOT_FOUND_ID'), cabinetID);
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
                    .textContent(Translate.translate('DEPARTURES.UNRECOGNIZABLE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('DEPARTURES.UNRECOGNIZABLE.MESSAGES.PENDING_CABINETS'))
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

        vm.createCabinet = function createCabinet() {
            $mdDialog.show({
                controller: 'notCapitalizedDialogController',
                templateUrl: 'app/mainApp/inventory/notCapitalized/dialog/dialogCreateNotCapitalized.tmpl.html',
                controllerAs: 'vm',
                fullscreen: true,
                clickOutsideToClose: true
            }).then(function (successCallback) {

                addCabinetToList(successCallback);
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errorTranslate(err);
                }
            });
        };

        vm.changeSwitch = function changeSwitch() {
            //Removing mutual excluding variables when the switch is changed
            delete (vm.departure[vm.catalogues['udn'].binding]);
            delete (vm.departure[vm.catalogues['petition'].binding]);
        };

        //Internal functions

        var saveDeparture = function saveDeparture(departure) {
            departure = addCabinetsToDeparture(vm.cabinetList, departure);
            //API callback
            vm.createDeparturePromise = MANUAL_DEPARTURES
                .createUnrecognizable(departure)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('DEPARTURES.UNRECOGNIZABLE.MESSAGES.SUCCESS_CREATE')
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
            if (departure.no_capitalizados_id.length) {
                departure.no_capitalizados_id = [];
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
                departure['no_capitalizados_id'].push(existingCabinets[i].id);
            }
            return departure;
        };

        var addCabinetToList = function addCabinetToList(cabinet) {
            var cabinetToAdd = {
                promise: null,
                cabinet: cabinet,
                id: cabinet['id']
            };

            vm.cabinetList.push(cabinetToAdd);
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
