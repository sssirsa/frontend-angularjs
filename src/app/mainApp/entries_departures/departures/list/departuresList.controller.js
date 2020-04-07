(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .controller('departuresListController', DeparturesListController);

    function DeparturesListController(
        MANUAL_DEPARTURES,
        PAGINATION,
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
        vm.departureKindFilter;
        vm.departureKindList;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };
        vm.endDate;
        vm.assetsQuantity;
        vm.showSelector;
        vm.user;
        vm.entriesToAgency;
        vm.subsidiaryAdmin;
        vm.agencyAdmin;

        vm.departures = [];

        vm.catalogues = {
            subsidiary: {
                binding: 'sucursal_destino',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.subsidiary,

                    name: Translate.translate('DEPARTURES.LIST.LABELS.SUBSIDIARY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'nombre'
                },
                hint: Translate.translate('DEPARTURES.LIST.HINTS.SUBSIDIARY'),
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
                    name: Translate.translate('DEPARTURES.LIST.LABELS.AGENCY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'agencia'
                },
                hint: Translate.translate('DEPARTURES.LIST.HINTS.AGENCY'),
                icon: 'fa fa-building',
                required: true
            }
        };

        function init() {
            vm.departureKindFilter = 'all-departures';
            vm.showSelector = false;
            vm.departureToAgency = false; //Determines what catalog to show (Petition or udn)
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

            vm.departuresFilter = {};
            var today = new Date();
            vm.startDate = today.toISOString();
            vm.endDate = today.toISOString();
            vm.departuresFilter[QUERIES.entries_departures.start_date] = vm.startDate;
            vm.departuresFilter[QUERIES.entries_departures.end_date] = vm.endDate;
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
                departureId: departure._id,
                departure: departure
            });
        };

        vm.generateXLSX = function (departureId) {
            vm.generateReportPromise = MANUAL_DEPARTURES.generateReport(departureId)
                .catch(function (errorResponse) {
                    ErrorHandler.errorTranslate(errorResponse);
                });
        };

        vm.startDateChange = function () {
            vm.departuresFilter[QUERIES.entries_departures.start_date] = vm.startDate;
            dateChange();
        };

        vm.endDateChange = function () {
            vm.departuresFilter[QUERIES.entries_departures.end_date] = vm.endDate;
            dateChange();
        };

        vm.onDestinationSelect = function (element) {
            if ((vm.showSelector && vm.departuresToAgency) || vm.agencyAdmin) {
                vm.departuresFilter[QUERIES.entries_departures.by_agency] = element;
            }
            if ((vm.showSelector && !vm.departuresToAgencyºº) || vm.subsidiaryAdmin) {
                vm.departuresFilter[QUERIES.entries_departures.by_subsidiary] = element;
            }
            vm.departures = [];
        };

        //Internal functions        
        function dateChange() {
            vm.departures = [];
            vm.departureKindFilter = 'all-departures';
            loadDepartures(vm.departureKindFilter);
        }

        function loadDepartures(filter) {
            vm.departures = [];
            switch (filter) {
                case 'all-departures':
                    vm.departureKindList = null;
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = null;
                    break;
                case 'new-departures':
                    vm.departureKindList = 'new';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.new;
                    break;
                case 'obsolete-departures':
                    vm.departureKindList = 'obsolete';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.obsolete;
                    break;
                case 'salepoint-departures':
                    vm.departureKindList = 'salepoint';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.salepoint;
                    break;
                case 'unrecognizable-departures':
                    vm.departureKindList = 'unrecognizable';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.unrecognizable;
                    break;
                case 'warehouse-departures':
                    vm.departureKindList = 'warehouse';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.warehouse;
                    break;
                case 'warranty-departures':
                    vm.departureKindList = 'warranty';
                    vm.departuresFilter[QUERIES.entries_departures.departure_kind] = QUERIES.entries_departures.warranty;
                    break;
            }

            vm.loadingDepartures = MANUAL_DEPARTURES
                .listDepartures(vm.departuresFilter, 1)
                .then(function (departuresList) {
                    vm.departures = departuresList;
                    vm.assetsQuantity = calculateAssetQuantity();
                })
                .catch(function (departuresListError) {
                    ErrorHandler.errorTranslate(departuresListError);
                });
        }

        function calculateAssetQuantity() {
            var quantity = 0;
            angular.forEach(vm.departures, function (value) {
                quantity += value.cabinets.length;
            });
            return quantity;
        }

    }
})();
