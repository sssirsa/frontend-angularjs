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
        vm.change;
        vm.assets;

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
                vm.loadingChange = MANUAL_CHANGES
                    .detail(vm.changeId)
                    .then(function (change) {
                        vm.change = change;
                        loadAssetStatus();
                    })
                    .catch(function (changeError) {
                        ErrorHandler.errorTranslate(changeError);
                    });
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
