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
        vm.entryDates;
        vm.today;

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
            vm.today = new Date();
            vm.startDate = vm.today.toISOString();
            vm.endDate = vm.today.toISOString();
            vm.entryDates = false;
            vm.changesFilter[QUERIES.entries_departures.start_date_departure] = vm.startDate;
            vm.changesFilter[QUERIES.entries_departures.end_date_departure] = vm.endDate;
            loadChanges(vm.changeKindFilter);
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
            if (vm.entryDates) {
                vm.changesFilter[QUERIES.entries_departures.start_date_entry] = vm.startDate;
            }
            else {
                vm.changesFilter[QUERIES.entries_departures.start_date_departure] = vm.startDate;
            }
            dateChange();
        };
        vm.endDateChange = function () {
            if (vm.entryDates) {
                vm.changesFilter[QUERIES.entries_departures.end_date_entry] = vm.endDate;
            }
            else {
                vm.changesFilter[QUERIES.entries_departures.end_date_departure] = vm.endDate;
            }
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
            loadChanges(vm.changeKindFilter);
        };

        vm.changeSwitchDate = function () {
            delete vm.changesFilter[QUERIES.entries_departures.start_date_departure];
            delete vm.changesFilter[QUERIES.entries_departures.end_date_departure];
            delete vm.changesFilter[QUERIES.entries_departures.start_date_entry];
            delete vm.changesFilter[QUERIES.entries_departures.end_date_entry];
            //Re setting date to today
            vm.startDate = vm.today.toISOString();
            vm.endDate = vm.today.toISOString();
            if(vm.entryDates){
                vm.changesFilter[QUERIES.entries_departures.start_date_entry] = vm.startDate;
                vm.changesFilter[QUERIES.entries_departures.end_date_entry]= vm.endDate;
            }
            else{
                vm.changesFilter[QUERIES.entries_departures.start_date_departure]=vm.startDate;
                vm.changesFilter[QUERIES.entries_departures.end_date_departure]=vm.endDate;
            }
            loadChanges(vm.changeKindFilter);
        };

        vm.onOriginSelect = function (element, binding) {
            vm.changesFilter[binding] = element;
            loadChanges(vm.changeKindFilter);
        };

        vm.onDestinationSelect = function (element, binding) {
            vm.changesFilter[binding] = element;
            loadChanges(vm.changeKindFilter);
        };

        //Internal functions

        function dateChange() {
            vm.changes = [];
            vm.changeKindFilter = 'all-changes';
            loadChanges(vm.changeKindFilter);
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
