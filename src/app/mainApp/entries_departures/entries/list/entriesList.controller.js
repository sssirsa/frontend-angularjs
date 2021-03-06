(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .controller('entriesListController', EntriesListController);

    function EntriesListController(
        MANUAL_ENTRIES,
        ErrorHandler,
        $state,
        QUERIES,
        User,
        EnvironmentConfig,
        URLS,
        Translate
    ) {
        var vm = this;

        //Variables
        vm.entryKindFilter;
        vm.entryKindList;
        vm.entriesFilter; //URL params
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };
        vm.startDate;
        vm.endDate;
        vm.assetsQuantity;
        vm.showSelector;
        vm.user;
        vm.entriesToAgency;
        vm.subsidiaryAdmin;
        vm.agencyAdmin;

        vm.entries = [];

        vm.catalogues = {
            subsidiary: {
                binding: 'sucursal_destino',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.subsidiary,

                    name: Translate.translate('ENTRIES.LIST.LABELS.SUBSIDIARY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'nombre'
                },
                hint: Translate.translate('ENTRIES.LIST.HINTS.SUBSIDIARY'),
                icon: 'fa fa-warehouse',
                required: true
            },
            udn: {
                binding: 'udn_origen',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.udn,
                    name: Translate.translate('ENTRIES.LIST.LABELS.AGENCY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'agencia'
                },
                hint: Translate.translate('ENTRIES.LIST.HINTS.AGENCY'),
                icon: 'fa fa-building',
                required: true
            }
        };

        function init() {
            vm.entryKindFilter = 'all-entries';
            vm.showSelector = false;
            vm.entryToAgency = false; //Determines what catalog to show (Petition or udn)
            vm.user = User.getUser();
            //Determining whether or not to show the Subsidiary or the Udn selector.
            vm.showSelector = !vm.user['sucursal']
                && !vm.user['udn'];
            if (vm.user.sucursal) {
                if (!vm.user.sucursal._id) {
                    vm.subsidiaryAdmin = true;
                }
            }
            if (vm.user.udn) {
                if (!vm.user.udn._id) {
                    vm.agencyAdmin = true;
                }
            }

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

        vm.onDestinationSelect = function (element) {
            if ((vm.showSelector && vm.entriesToAgency) || vm.agencyAdmin) {
                vm.entriesFilter[QUERIES.entries_departures.by_agency] = element;
            }
            if ((vm.showSelector && !vm.entriesToAgency) || vm.subsidiaryAdmin) {
                vm.entriesFilter[QUERIES.entries_departures.by_subsidiary] = element;
            }
            vm.entries=[];
        };

        //Internal functions

        function dateChange() {
            vm.entries = [];            
            vm.entryKindFilter = 'all-entries';
            loadEntries(vm.entryKindFilter);
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
