(function () {
    angular
        .module('app.mainApp.entries_departures')
        .controller('entriesListController', EntriesListController);

    function EntriesListController(
        MANUAL_ENTRIES,
        PAGINATION,
        ErrorHandler
    ) {
        var vm = this;

        //Variables
        vm.entryKindFilter;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        vm.entries;

        function init() {
            vm.entryKindFilter = 'all-entries';
            loadEntries(vm.entryKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.entryKindFilter = filter;
            loadEntries(filter);
        }

        //Internal functions
        function loadEntries(filter, page) {
            vm.entries = [];
            page ? null : page = 1;
            var entryKind;
            switch (filter) {
                case 'all-entries':
                    entryKind = null;
                    break;
                case 'new-entries':
                    entryKind = 'new';
                    break;
                case 'repair-entries':
                    entryKind = 'repair';
                    break;
                case 'unrecognizable-entries':
                    entryKind = 'unrecognizable';
                    break;
                case 'warehouse-entries':
                    entryKind = 'warehouse';
                    break;
                case 'warranty-entries':
                    entryKind = 'warranty';
                    break;
            }

            vm.loadingEntries = MANUAL_ENTRIES
                .listEntries(entryKind, 1)
                .then(function (entriesList) {
                    vm.entries = entriesList[PAGINATION.elements];
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        entriesList[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (entriesListError) {
                    ErrorHandler.errorTranslate(entriesListError);
                });
        }

    }
})();
