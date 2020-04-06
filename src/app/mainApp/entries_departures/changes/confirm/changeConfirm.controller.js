(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesConfirmController', ChangesConfirmController);
    function ChangesConfirmController(
        $stateParams,
        ErrorHandler,
        MANUAL_CHANGES,
        toastr,
        Translate
    ) {
        var vm = this;
        vm.changeId;
        vm.changeKind;
        vm.change;
        vm.confirmedAssets;
        vm.nonConfirmedAssets;
        vm.nonExpectedAssets;

        function init() {
            vm.changeId = $stateParams.changeId;
            loadChange();
        }
        init();

        //Private functions
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
                            loadAssets();
                        })
                        .catch(function (changeError) {
                            ErrorHandler.errorTranslate(changeError);
                        });
                }
            }
            else {
                vm.change = $stateParams.change;
                loadAssets();
            }
        }

        function loadAssets() {
            if (!vm.nonConfirmedAssets) {
                vm.nonConfirmedAssets = [];
            }
            vm.nonConfirmedAssets = vm.change.cabinets;
        }

        vm.confirmFridge = function(fridgeInventoryNumber){
            if (fridgeInventoryNumber.length > 0) {
                var index = vm.nonConfirmedAssets
                    .map(function (element) {
                        return element.id;
                    }).indexOf(fridgeInventoryNumber);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('CHANGES.CONFIRM.ERRORS.NOT_FOUND_ID'), fridgeInventoryNumber);
                }
                else {
                    vm.confirmedAssets.push(vm.nonConfirmedAssets[index]);
                    vm.nonConfirmedAssets.splice(index, 1);
                }
            }
        };

        vm.unConfirmFridge = function(fridgeInventoryNumber){
            if (fridgeInventoryNumber.length > 0) {
                var index = vm.confirmedAssets
                    .map(function (element) {
                        return element.id;
                    }).indexOf(fridgeInventoryNumber);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('CHANGES.CONFIRM.ERRORS.NOT_FOUND_ID'), fridgeInventoryNumber);
                }
                else {
                    vm.nonConfirmedAssets.push(vm.confirmedAssets[index]);
                    vm.confirmedAssets.splice(index, 1);
                }
            }
        };

        vm.generateXLSX = function () {
            vm.generateReportPromise = MANUAL_CHANGES.generateReport(vm.changeId)
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

    }
})();
