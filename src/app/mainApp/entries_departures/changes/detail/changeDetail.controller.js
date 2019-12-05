(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesDetailController', ChangesDetailController);
    function ChangesDetailController(
        $stateParams,
        ErrorHandler,
        MANUAL_CHANGES
    ) {
        var vm = this;
        vm.changeId;
        vm.changeKind;
        vm.change;
        vm.assets;

        function init() {
            vm.changeId = $stateParams.changeId;
            vm.changeKind = $stateParams.changeKind;
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
                if (vm.changeKind === 'sucursal') {
                    vm.loadingChange = MANUAL_CHANGES.subsidiaryDetail(vm.changeId);
                }
                if (vm.changeKind === 'agencia') {
                    vm.loadingChange = MANUAL_CHANGES.agencyDetail(vm.changeId);
                }
                if (vm.loadingChange) {
                    vm.loadingChange
                        .then(function (change) {
                            vm.change = change;
                            loadAssetStatus();
                        })
                        .catch(function (changeError) {
                            ErrorHandler.errorTranslate(changeError);
                        });
                }
                else {
                    throw new Error('Parameter "changeKind" was not provided on the url');
                }
            }
            else {
                vm.change = $stateParams.change;
                loadAssetStatus();
            }
        }

        function loadAssetStatus() {
            if (!vm.assets) {
                vm.assets = [];
            }
            vm.assets = vm.change.cabinets;
        }

    }
})();
