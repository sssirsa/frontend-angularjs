(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .controller('changesListController', ChangesListController);

    function ChangesListController(
        MANUAL_CHANGES,
        ErrorHandler,
        $state,
        User
    ) {
        var vm = this;

        //Variables
        vm.changeKindFilter;
        vm.changeKindList;
        vm.loadingChanges;
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

        vm.generatePDF = function () {
            //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (change) {
            var changeKind;
            if (vm.agencyChange) {
                changeKind = 'agencia';
            }
            else {
                changeKind = 'sucursal';
            }
            $state.go('triangular.admin-default.change-detail', {
                changeId: change._id,
                changeKind: changeKind,
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
        function loadChanges() {
            vm.changes = [];
            if (vm.showSelector) {
                //User has no location
                if (vm.agencyChange) {
                    vm.loadingChanges = MANUAL_CHANGES.getChanges(
                        vm.filters[vm.catalogues['destination_udn'].binding],
                        vm.filters[vm.catalogues['origin_udn'].binding]
                    );
                }
                else {
                    vm.loadingChanges = MANUAL_CHANGES.getChanges(
                        null,
                        null,
                        vm.filters[vm.catalogues['destination_subsidiary'].binding],
                        vm.filters[vm.catalogues['origin_subsidiary'].binding]
                    );
                }
            }
            else {
                //User has a location
                if (vm.user['sucursal']) {
                    //Subsidiary user
                    vm.loadingChanges = MANUAL_CHANGES.getChanges(
                        null,
                        null,
                        vm.filters[vm.catalogues['destination_subsidiary'].binding],
                        vm.filters[vm.catalogues['origin_subsidiary'].binding]
                    );
                }
                if (vm.user['udn']) {
                    //Agency user
                    vm.agencyChange = true;
                    vm.loadingChanges = MANUAL_CHANGES.getChanges(
                        vm.filters[vm.catalogues['destination_udn'].binding],
                        vm.filters[vm.catalogues['origin_udn'].binding]
                    );
                }
            }

            vm.loadingChanges
                .then(function (changesList) {
                    vm.changes = changesList;
                })
                .catch(function (changesListError) {
                    ErrorHandler.errorTranslate(changesListError);
                });
        }

    }
})();
