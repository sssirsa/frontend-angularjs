(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesDetailController', ChangesDetailController);
    function ChangesDetailController(
        $stateParams,
        ErrorHandler,
        MANUAL_DEPARTURES
    ) {
        var vm = this;
        vm.departureId;
        vm.departure;
        vm.assets;

        function init() {
            vm.departureId = $stateParams.departureId;
            loadDeparture();
        }
        init();

        //Private functions
        function loadDeparture(forceReload) {
            if (vm.assets) {
                //Re-setting assets variable
                vm.assets = [];
            }
            if (!$stateParams.departure || forceReload) {
                vm.loadingDeparture = MANUAL_DEPARTURES
                    .detail(vm.departureId)
                    .then(function (departure) {
                        vm.departure = departure;
                        loadAssetStatus();
                    })
                    .catch(function (departureError) {
                        ErrorHandler.errorTranslate(departureError);
                    });
            }
            else {
                vm.departure = $stateParams.departure;
                loadAssetStatus();
            }
        }

        function loadAssetStatus() {
            if (!vm.assets) {
                vm.assets = [];
            }
            vm.assets = vm.departure.cabinets;
        }

    }
})();
