(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesListController', ChangesListController);

    function ChangesListController(
        MANUAL_CHANGES,
        ErrorHandler,
        $state,
        User,
        QUERIES
    ) {
        var vm = this;

        //Variables
        vm.changeKindFilter;
        vm.changesFilter; //URL params
        vm.loadingChanges;
        vm.user = User.getUser();

        vm.agencyChange;
        vm.startDate;
        vm.endDate;
        vm.assetsQuantity;
        vm.showSelector;
        vm.user;
        vm.subsidiaryAdmin;
        vm.agencyAdmin;

        vm.changes = [];

        //Constants
        vm.catalogues = MANUAL_CHANGES.listChanges.catalogues();

        function init() {
            vm.changeKindFilter = 'all-changes';
            vm.user = User.getUser();

            vm.showSelector = !vm.user['sucursal']
                && !vm.user['udn'];

            vm.agencyChange = false;
            if (vm.user.sucursal) {
                if (!vm.user.sucursal._id) {
                    vm.subsidiaryAdmin = true;
                }
            }
            if (vm.user.sucursal) {
                if (!vm.user.sucursal._id) {
                    vm.agencyAdmin = true;
                }
            }
            vm.changesFilter = {};
            var today = new Date();
            vm.startDate = today.toISOString();
            vm.endDate = today.toISOString();
            vm.changesFilter[QUERIES.entries_departures.start_date_departure] = vm.startDate;
            vm.changesFilter[QUERIES.entries_departures.end_date_entry] = vm.endDate;
            loadChanges(vm.entryKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.changeKindFilter = filter;
            loadChanges(filter);
        };

        vm.generatePDF = function () {
            //TODO:Create functionality for PDF
        };

        vm.generateXLSX = function (changeId) {
            vm.generateReportPromise = MANUAL_CHANGES.generateReport(changeId)
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

        vm.startDateChange = function () {
            vm.changesFilter[QUERIES.entries_departures.start_date_departure] = vm.startDate;
            dateChange();
        };

        vm.endDateChange = function () {
            vm.changesFilter[QUERIES.entries_departures.end_date_entry] = vm.endDate;
            dateChange();
        };

        vm.navigateToDetail = function (change) {
            $state.go('triangular.admin-default.change-detail', {
                changeId: change._id,
                change: change
            });
        };

        vm.changeSwitch = function () {
            delete vm.changesFilter[vm.catalogues['origin_udn'].binding];
            delete vm.changesFilter[vm.catalogues['destination_udn'].binding];
            delete vm.changesFilter[vm.catalogues['origin_subsidiary'].binding];
            delete vm.changesFilter[vm.catalogues['destination_subsidiary'].binding];
            loadChanges();
        };

        vm.onOriginSelect = function (element, binding) {
            vm.changesFilter[binding] = element;
            loadChanges();
        };

        vm.onDestinationSelect = function (element, binding) {
            vm.changesFilter[binding] = element;
            loadChanges();
        };

        //Internal functions

        function dateChange() {
            vm.changes = [];
            vm.changeKindFilter = 'all-changes';
            loadChanges();
        }

        function loadChanges(filter) {
            vm.changes = [];

            switch (filter) {
                case 'confirmed-changes':
                    vm.changesFilter[QUERIES.entries_departures.confirmed_change] = true;
                    break;
                case 'non-confirmed-changes':
                    vm.changesFilter[QUERIES.entries_departures.confirmed_change] = false;
                    break;
                case 'all-changes':
                    delete vm.changesFilter[QUERIES.entries_departures.confirmed_change];
                    break;
                default:
                    delete vm.changesFilter[QUERIES.entries_departures.confirmed_change];
                    break;
            }

            vm.loadingChanges = MANUAL_CHANGES.getChanges(vm.changesFilter);

            vm.loadingChanges
                .then(function (changesList) {
                    vm.changes = changesList;
                    vm.assetsQuantity = calculateAssetQuantity();
                })
                .catch(function (changesListError) {
                    ErrorHandler.errorTranslate(changesListError);
                });
        }

        function calculateAssetQuantity() {
            var quantity = 0;
            angular.forEach(vm.changes, function (value) {
                quantity += value.cabinets.length;
            });
            return quantity;
        }

    }
})();
