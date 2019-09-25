(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesListController', ChangesListController);

    function ChangesListController(
        MANUAL_DEPARTURES,
        PAGINATION,
        ErrorHandler,
        $state
    ) {
        var vm = this;

        //Variables
        vm.departureKindFilter;
        vm.departureKindList;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        vm.departures=[];

        function init() {
            vm.departureKindFilter = 'all-departures';
            loadDepartures(vm.departureKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.departureKindFilter = filter;
            loadDepartures(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreDepartures = MANUAL_DEPARTURES
                .listDepartures(vm.departureKindList, vm.paginationHelper.page + 1)
                .then(function (departuresList) {
                    vm.paginationHelper.page++;
                    vm.departures = vm.departures.concat(departuresList[PAGINATION.elements]);
                })
                .catch(function (departuresListError) {
                    ErrorHandler.errorTranslate(departuresListError);
                });
        };

        vm.generatePDF = function () {
        //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (departure) {
            $state.go('triangular.admin-default.departure-detail', {
                departureId: departure.id,
                departure:departure
            });
        };

        //Internal functions
        function loadDepartures(filter, page) {
            vm.departures = [];
            page ? null : page = 1;
            switch (filter) {
                case 'all-departures':
                    vm.departureKindList = null;
                    break;
                case 'new-departures':
                    vm.departureKindList = 'new';
                    break;
                case 'obsolete-departures':
                    vm.departureKindList = 'obsolete';
                    break;
                case 'unrecognizable-departures':
                    vm.departureKindList = 'unrecognizable';
                    break;
                case 'warehouse-departures':
                    vm.departureKindList = 'warehouse';
                    break;
                case 'warranty-departures':
                    vm.departureKindList = 'warranty';
                    break;
            }

            vm.loadingDepartures = MANUAL_DEPARTURES
                .listDepartures(vm.departureKindList, 1)
                .then(function (departuresList) {
                    vm.departures = departuresList[PAGINATION.elements];
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        departuresList[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (departuresListError) {
                    ErrorHandler.errorTranslate(departuresListError);
                });
        }

    }
})();
