(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .controller('entriesListController', EntriesListController);

    function EntriesListController(
        MANUAL_ENTRIES,
        PAGINATION,
        ErrorHandler,
        $state
    ) {
        var vm = this;

        //Variables
        vm.entryKindFilter;
        vm.entryKindList;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        vm.entries=[];

        function init() {
            vm.entryKindFilter = 'all-entries';
            loadEntries(vm.entryKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.entryKindFilter = filter;
            loadEntries(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreEntries = MANUAL_ENTRIES
                .listEntries(vm.entryKindList, vm.paginationHelper.page + 1)
                .then(function (entriesList) {
                    vm.paginationHelper.page++;
                    vm.entries = vm.entries.concat(entriesList[PAGINATION.elements]);
                })
                .catch(function (entriesListError) {
                    ErrorHandler.errorTranslate(entriesListError);
                });
        };

        vm.addAssetCliecked = function () {
        //TODO:Add asset dialog
        };

        vm.generatePDF = function () {
        //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (entry) {
            $state.go('triangular.admin-default.entry-detail', {
                entryId: entry.id,
                entry:entry
            });
        };

        vm.generateXLSX = function (entryId) {
            vm.generateReportPromise = MANUAL_ENTRIES.generateReport(entryId);
        };

        //Internal functions
        function loadEntries(filter, page) {
            vm.entries = [];
            page ? null : page = 1;
            switch (filter) {
                case 'all-entries':
                    vm.entryKindList = null;
                    break;
                case 'new-entries':
                    vm.entryKindList = 'new';
                    break;
                case 'repair-entries':
                    vm.entryKindList = 'repair';
                    break;
                case 'unrecognizable-entries':
                    vm.entryKindList = 'unrecognizable';
                    break;
                case 'warehouse-entries':
                    vm.entryKindList = 'warehouse';
                    break;
                case 'warranty-entries':
                    vm.entryKindList = 'warranty';
                    break;
            }

            vm.loadingEntries = MANUAL_ENTRIES
                .listEntries(vm.entryKindList, 1)
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
