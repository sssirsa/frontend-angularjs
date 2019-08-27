(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .controller('entryDetailController', EntryDetailController);
    function EntryDetailController(
        $stateParams,
        ErrorHandler,
        Translate,
        toastr,
        MANUAL_ENTRIES,
        PAGINATION,
        $mdDialog
    ) {
        var vm = this;
        vm.entryId;
        vm.entry;
        vm.assets;
        vm.missingAssets;

        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        function init() {
            vm.entryId = $stateParams.entryId;
            loadEntry();
        }
        init();

        //Functions

        vm.loadMoreAssetStatus = function () {
            loadAssetStatus(vm.paginationHelper.page + 1);
        };

        vm.setAssetAsMissing = function (assetID, index) {
            vm.assets[index].estado = 'Faltante';
            if (!vm.missingAssets) {
                vm.missingAssets = [];
            }
            vm.missingAssets.push(assetID);
        };

        vm.unsetAssetAsMissing = function (assetID, index) {
            vm.assets[index].estado = 'Pendiente';
            var missingIndex = vm.missingAssets.indexOf(
                vm.missingAssets.find(function (element) {
                    return element == assetID;
                })
            );
            vm.missingAssets.splice(missingIndex, 1);
        };

        vm.showConfirmCloseDialog = function () {
            var confirm = $mdDialog.confirm()
                .title(Translate.translate('ENTRIES.DETAIL.DIALOGS.CONFIRM.TITLE'))
                .textContent(Translate.translate('ENTRIES.DETAIL.DIALOGS.CONFIRM.CONTENT'))
                .ariaLabel('Confirm entry closing')
                .ok(Translate.translate('ENTRIES.DETAIL.DIALOGS.CONFIRM.OK'))
                .cancel(Translate.translate('ENTRIES.DETAIL.DIALOGS.CONFIRM.CANCEL'));

            $mdDialog.show(confirm)
                .then(function () {
                    closeEntry();
                });
        };

        //Private functions
        function loadEntry(forceReload) {
            if (!$stateParams.entry||forceReload) {
                vm.loadingEntry = MANUAL_ENTRIES
                    .detail(vm.entryId)
                    .then(function (entry) {
                        vm.entry = entry;
                    })
                    .catch(function (entryError) {
                        ErrorHandler.errorTranslate(entryError);
                    });
            }
            else {
                vm.entry = $stateParams.entry;
            }
            loadAssetStatus();
        }

        function loadAssetStatus(page) {
            if (!vm.assets) {
                vm.assets = [];
            }
            page ? null : page = 1;
            vm.assetStatusPromise = MANUAL_ENTRIES
                .getAssetStatus(vm.entryId, page)
                .then(function (assetsStatus) {
                    vm.assets = vm.assets.concat(assetsStatus[PAGINATION.elements]);
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        assetsStatus[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (assetStatusError) {
                    ErrorHandler.errorTranslate(assetStatusError);
                });
        }

        function closeEntry() {
            var closeElement = {
                cabinets_faltantes: vm.missingAssets
            };
            vm.closingEntry = MANUAL_ENTRIES
                .close(vm.entryId, closeElement)
                .then(function () {
                    toastr.success(Translate.translate('ENTRIES.DETAIL.MESSAGES.SUCCESS'));
                    loadEntry(true);
                })
                .catch(function (error) {
                    ErrorHandler.errorTranslate(error);
                });
        }
    }
})();
