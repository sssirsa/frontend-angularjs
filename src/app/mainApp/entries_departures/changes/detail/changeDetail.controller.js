(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesDetailController', ChangesDetailController);
    function ChangesDetailController(
        $stateParams,
        ErrorHandler,
        MANUAL_CHANGES,
        $state
    ) {
        var vm = this;
        vm.changeId;
        vm.changeKind;
        vm.change;
        vm.assets;

        function init() {
            vm.changeId = $stateParams.changeId;
            loadChange();
        }
        init();        

        vm.navigateToConfirm = function (change) {
            $state.go('triangular.admin-default.change-confirm', {
                changeId: change._id,
                change: change
            });
        };

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
            if (!vm.assets) {
                vm.assets = [];
            }
            vm.assets = vm.change.cabinets;
        }

        vm.generateXLSX = function () {
            vm.generateReportPromise = MANUAL_CHANGES.generateReport(vm.changeId)
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

    }
})();
