(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .controller('departureDetailController', DepartureDetailController);
    function DepartureDetailController(
        $stateParams,
        ErrorHandler,
        Translate,
        toastr,
        MANUAL_DEPARTURES,
        PAGINATION
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
