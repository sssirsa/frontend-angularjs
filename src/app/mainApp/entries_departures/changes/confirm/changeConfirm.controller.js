(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesConfirmController', ChangesConfirmController);
    function ChangesConfirmController(
        $stateParams,
        ErrorHandler,
        MANUAL_CHANGES,
        toastr,
        Translate,
        $state,
        User
    ) {
        var vm = this;
        vm.locationRestricted;
        vm.changeId;
        vm.changeKind;
        vm.change;
        vm.cabinetID;
        vm.confirmedAssets;
        vm.nonConfirmedAssets;
        vm.nonExpectedAssets;

        vm.receivedAssetsIds;

        vm.user;

        function init() {
            vm.changeId = $stateParams.changeId;
            vm.confirmedAssets = [];
            vm.nonExpectedAssets = [];
            vm.receivedAssetsIds = [];
            loadChange();
        }
        init();

        //Private functions
        function verifyLocation() {
            vm.user = User.getUser();
            if (vm.user.sucursal) {
                if (vm.user.sucursal._id) {
                    if (vm.user.sucursal._id !== vm.change.sucursal_destino._id) {
                        vm.locationRestricted = true;
                    }
                    if (vm.change.udn_destino) {
                        vm.locationRestricted = true;
                    }
                }
            }
            if (vm.user.udn) {
                if (vm.user.udn._id) {
                    if (vm.user.udn._id !== vm.change.udn_destino._id) {
                        vm.locationRestricted = true;
                    }
                    if (vm.change.sucursal_destino) {
                        vm.locationRestricted = true;
                    }
                }
            }
        }
        function loadChange(forceReload) {
            if (vm.assets) {
                //Re-setting assets variable
                vm.assets = [];
            }
            if (!$stateParams.change || forceReload) {
                vm.loadingChange = MANUAL_CHANGES.changeDetail(vm.changeId);

                if (vm.loadingChange) {
                    vm.loadingChange
                        .then(function (change) {
                            vm.change = change;
                            verifyLocation();
                            loadAssets();
                        })
                        .catch(function (changeError) {
                            ErrorHandler.errorTranslate(changeError);
                        });
                }
            }
            else {
                vm.change = $stateParams.change;
                verifyLocation();
                loadAssets();
            }
        }

        function loadAssets() {
            if (!vm.nonConfirmedAssets) {
                vm.nonConfirmedAssets = [];
            }
            vm.nonConfirmedAssets = vm.change.cabinets;
        }

        vm.confirmFridge = function (fridgeInventoryNumber) {
            if (fridgeInventoryNumber.length > 0) {
                vm.cabinetID = null;
                var index = vm.nonConfirmedAssets
                    .map(function (element) {
                        return element.economico;
                    }).indexOf(fridgeInventoryNumber);
                if (index === -1) {
                    //Cabinet not found in non expected list
                    var confirmedIndex = vm.confirmedAssets
                        .map(function (element) {
                            return element.economico;
                        }).indexOf(fridgeInventoryNumber);
                    if (confirmedIndex === -1) {
                        //Also not found in expected list
                        //Is a non expected asset
                        vm.nonExpectedAssets.unshift(fridgeInventoryNumber);
                        vm.receivedAssetsIds.unshift(fridgeInventoryNumber);
                    }
                    else {
                        toastr.warning(Translate.translate('CHANGES.CONFIRM.ERRORS.REPEATED_ID'), fridgeInventoryNumber);
                    }
                }
                else {
                    vm.confirmedAssets.unshift(vm.nonConfirmedAssets[index]);
                    vm.receivedAssetsIds.unshift(fridgeInventoryNumber);
                    vm.nonConfirmedAssets.splice(index, 1);
                }
            }
        };

        vm.unConfirmExpectedFridge = function (fridgeInventoryNumber) {
            if (fridgeInventoryNumber.length > 0) {
                var index = vm.confirmedAssets
                    .map(function (element) {
                        return element.economico;
                    }).indexOf(fridgeInventoryNumber);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('CHANGES.CONFIRM.ERRORS.NOT_FOUND_ID'), fridgeInventoryNumber);
                }
                else {
                    vm.nonConfirmedAssets.unshift(vm.confirmedAssets[index]);
                    vm.receivedAssetsIds.splice(index, 1);
                    vm.confirmedAssets.splice(index, 1);
                }
            }
        };

        vm.unConfirmUnexpectedFridge = function (fridgeInventoryNumber) {
            if (fridgeInventoryNumber.length > 0) {
                var index = vm.nonExpectedAssets
                    .map(function (element) {
                        return element;
                    }).indexOf(fridgeInventoryNumber);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('CHANGES.CONFIRM.ERRORS.NOT_FOUND_ID'), fridgeInventoryNumber);
                }
                else {
                    vm.receivedAssetsIds.splice(index, 1);
                    vm.nonExpectedAssets.splice(index, 1);
                }
            }
        };

        vm.clickButtonSave = function () {
            var subsidiary, agency;
            if (vm.user.sucursal || vm.user.udn) {
                if (vm.user.sucursal) {
                    if (vm.user.sucursal._id) {
                        subsidiary = vm.user.sucursal._id;
                    }
                    else {
                        if (vm.change.sucursal_destino) {
                            subsidiary = vm.change.sucursal_destino._id;
                        }
                    }
                }
                if (vm.user.udn) {
                    if (vm.user.udn._id) {
                        agency = vm.user.udn._id;
                    }
                    else {
                        if (vm.change.udn_destino._id) {
                            agency = vm.change.udn_destino._id;
                        }
                    }
                }
            }
            else {
                if (vm.change.sucursal_destino) {
                    subsidiary = vm.change.sucursal_destino._id;
                }
                if (vm.change.udn_destino) {
                    agency = vm.change.udn_destino._id;
                }
            }

            var request = {
                cabinets: vm.receivedAssetsIds,
                sucursal_destino: subsidiary,
                udn_destino: agency
            };
            vm.savePromise = MANUAL_CHANGES.confirmChange(vm.changeId, request)
                .then(function () {
                    toastr.success(Translate.translate('CHANGES.CONFIRM.MESSAGES.SUCCESS_CONFIRM'));
                    $state.go('triangular.admin-default.changes-list');
                })
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

    }
})();
