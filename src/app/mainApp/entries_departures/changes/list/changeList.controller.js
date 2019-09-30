(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesListController', ChangesListController);

    function ChangesListController(
        MANUAL_CHANGES,
        PAGINATION,
        ErrorHandler,
        $state,
        User
    ) {
        var vm = this;

        //Variables
        vm.changeKindFilter;
        vm.changeKindList;
        vm.loadingChanges;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };
        vm.filters;
        vm.user = User.getUser();
        vm.showSelector;
        vm.agencyChange;

        vm.changes = [];

        //Constants
        vm.catalogues = MANUAL_CHANGES.listChanges.catalogues();

        function init() {
            vm.showSelector = !vm.user['sucursal']
                && !vm.user['udn'];
            vm.agencyChange = false;
            vm.filters = {};
            //vm.changeKindFilter = 'all-changes';
            loadChanges();
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.changeKindFilter = filter;
            loadChanges(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreChanges = MANUAL_CHANGES
                .listChanges(vm.changeKindList, vm.paginationHelper.page + 1)
                .then(function (changesList) {
                    vm.paginationHelper.page++;
                    vm.changes = vm.changes.concat(changesList[PAGINATION.elements]);
                })
                .catch(function (changesListError) {
                    ErrorHandler.errorTranslate(changesListError);
                });
        };

        vm.generatePDF = function () {
            //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (change) {
            $state.go('triangular.admin-default.change-detail', {
                changeId: change.id,
                change: change
            });
        };

        vm.changeSwitch = function () {
            vm.filters = {};
            loadChanges();
        };

        vm.onOriginSelect = function (element, binding) {
            vm.filters[binding] = element;
            loadChanges();
        };

        //Internal functions
        function loadChanges(page) {
            vm.changes = [];
            page ? null : page = 1;
            if (vm.showSelector) {
                //User has no location
                if (vm.agencyChange) {
                    vm.loadingChanges = MANUAL_CHANGES.getAgency(page,
                        vm.filters[vm.catalogues['destination_udn'].binding],
                        vm.filters[vm.catalogues['origin_udn'].binding]
                    );
                }
                else {
                    vm.loadingChanges = MANUAL_CHANGES.getSubsidiary(page,
                        vm.filters[vm.catalogues['destination_subsidiary'].binding],
                        vm.filters[vm.catalogues['origin_subsidiary'].binding]
                    );
                }
            }
            else {
                //User has a location
                if (vm.user['sucursal']) {
                    //Subsidiary user
                    vm.loadingChanges = MANUAL_CHANGES.getSubsidiary(page,
                        vm.filters[vm.catalogues['destination_subsidiary'].binding],
                        vm.filters[vm.catalogues['origin_subsidiary'].binding]
                    );
                }
                if (vm.user['udn']) {
                    //Agency user
                    vm.loadingChanges = MANUAL_CHANGES.getAgency(page,
                        vm.filters[vm.catalogues['destination_udn'].binding],
                        vm.filters[vm.catalogues['origin_udn'].binding]
                    );
                }
            }

            vm.loadingChanges
                .then(function (changesList) {
                    vm.changes = changesList[PAGINATION.elements];
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        changesList[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (changesListError) {
                    ErrorHandler.errorTranslate(changesListError);
                });
        }

    }
})();
