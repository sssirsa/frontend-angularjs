(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .controller('entriesListController', EntriesListController);

    function EntriesListController(
        MANUAL_ENTRIES,
        PAGINATION,
        ErrorHandler,
        $state,
        QUERIES
    ) {
        var vm = this;

        //Variables
        vm.entryKindFilter;
        vm.entryKindList;
        vm.entriesFilter;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };
        vm.startDate;
        vm.endDate;
        vm.assetsQuantity;

        vm.entries = [];

        function init() {
            vm.entryKindFilter = 'all-entries';
            vm.entriesFilter = {};
            var today = new Date();
            vm.startDate = today.toISOString();
            vm.endDate = today.toISOString();
            vm.entriesFilter[QUERIES.entries_departures.start_date] = vm.startDate;
            vm.entriesFilter[QUERIES.entries_departures.end_date] = vm.endDate;
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

        vm.generatePDF = function () {
            //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (entry) {
            $state.go('triangular.admin-default.entry-detail', {
                entryId: entry._id,
                entry: entry
            });
        };

        vm.generateXLSX = function (entryId) {
            vm.generateReportPromise = MANUAL_ENTRIES.generateReport(entryId)
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

        vm.startDateChange = function () {
            vm.entriesFilter[QUERIES.entries_departures.start_date] = vm.startDate;
            dateChange();
        };

        vm.endDateChange = function () {
            vm.entriesFilter[QUERIES.entries_departures.end_date] = vm.endDate;
            dateChange();
        };
        //Internal functions

        function dateChange() {
            vm.entries = [];
            vm.entryKindFilter = null;
        }

        function loadEntries(filter) {
            vm.entries = [];
            //page ? null : page = 1;
            switch (filter) {
                case 'all-entries':
                    vm.entryKindList = null;
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = null;
                    break;
                case 'new-entries':
                    vm.entryKindList = 'new';
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = QUERIES.entries_departures.new;
                    break;
                case 'repair-entries':
                    vm.entryKindList = 'repair';
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = QUERIES.entries_departures.repair;
                    break;
                case 'unrecognizable-entries':
                    vm.entryKindList = 'unrecognizable';
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = QUERIES.entries_departures.unrecognizable;
                    break;
                case 'warehouse-entries':
                    vm.entryKindList = 'warehouse';
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = QUERIES.entries_departures.warehouse;
                    break;
                case 'warranty-entries':
                    vm.entryKindList = 'warranty';
                    vm.entriesFilter[QUERIES.entries_departures.entry_kind] = QUERIES.entries_departures.warranty;
                    break;
            }

            vm.loadingEntries = MANUAL_ENTRIES
                .listEntries(vm.entriesFilter)
                .then(function (entriesList) {
                    vm.entries = entriesList;
                    vm.assetsQuantity = calculateAssetQuantity();
                    // vm.paginationHelper.page = page;
                    // vm.paginationHelper.totalPages = Math.ceil(
                    //     entriesList[PAGINATION.total] / PAGINATION.pageSize
                    // );
                })
                .catch(function (entriesListError) {
                    ErrorHandler.errorTranslate(entriesListError);
                });
        }

        function calculateAssetQuantity() {
            var quantity = 0;
            angular.forEach(vm.entries, function (value) {
                quantity += value.cabinets.length;
            });
            return quantity;
        }

    }
})();
