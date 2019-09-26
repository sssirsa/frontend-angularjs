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
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };
        vm.user = User.getUser();
        vm.showSelector;
        vm.agencyChange;

        vm.changes = [];

        function init() {
            vm.showSelector = !vm.user['sucursal']
                && !vm.user['udn'];
            vm.agencyChange = false;
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

        //Internal functions
        function loadChanges(page) {
            vm.changes = [];
            page ? null : page = 1;
            // switch (filter) {
            //     case 'all-changes':
            //         vm.changeKindList = null;
            //         break;
            //     case 'new-changes':
            //         vm.changeKindList = 'new';
            //         break;
            //     case 'obsolete-changes':
            //         vm.changeKindList = 'obsolete';
            //         break;
            //     case 'unrecognizable-changes':
            //         vm.changeKindList = 'unrecognizable';
            //         break;
            //     case 'warehouse-changes':
            //         vm.changeKindList = 'warehouse';
            //         break;
            //     case 'warranty-changes':
            //         vm.changeKindList = 'warranty';
            //         break;
            // }

            if (vm.showSelector) {
                //User has no location
                
            }

            vm.loadingChanges = MANUAL_CHANGES
                .listChanges(vm.changeKindList, 1)
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
