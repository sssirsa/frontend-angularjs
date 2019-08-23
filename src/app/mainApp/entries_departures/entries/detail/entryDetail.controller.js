(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .controller('entryDetailController', EntryDetailController);
    function EntryDetailController(
        $stateParams,
        ErrorHandler,
        MANUAL_ENTRIES
    ) {
        var vm = this;
        vm.entryId;
        vm.entry;

        function init() {
            vm.entryId = $stateParams.entryId;
            loadEntry();
        }
        init();

        //Functions

        //Private functions
        function loadEntry() {
            if (!$stateParams.entry) {
                vm.loadingEntry = MANUAL_ENTRIES
                    .detail(vm.entryId)
                    .then(function (entry) {
                        vm.entry = entry;
                    })
                    .catch(function (entryError) {
                        ErrorHandler.errorTranslate(entryError);
                    });
            }
            else {
                vm.entry = $stateParams.entry;
            }
        }
    }
})();
