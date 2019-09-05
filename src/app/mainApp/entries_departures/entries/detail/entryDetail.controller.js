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
            if (entryHasPendingCabinets()) {
                toastr.info(Translate.translate('ENTRIES.DETAIL.MESSAGES.PENDING_ASSETS'));
            }
            else {
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
            }
        };

        vm.addAssetClicked = function () {
            var dialog = {
                controller: 'addCabinetToEntryDialogController',
                templateUrl: 'app/mainApp/entries_departures/entries/detail/modal/addCabinetDialog.tmpl.html',
                clickOutsideToClose: true,
                fullscreen: true,
                controllerAs: 'vm'
            };

            $mdDialog.show(dialog)
                .then(function (asset) {
                    addAsset(asset);
                });

        };

        //Private functions
        function loadEntry(forceReload) {
            if (vm.assets) {
                //Re-setting assets variable
                vm.assets = [];
            }
            if (!$stateParams.entry || forceReload) {
                vm.loadingEntry = MANUAL_ENTRIES
                    .detail(vm.entryId)
                    .then(function (entry) {
                        vm.entry = entry;
                        loadAssetStatus();
                    })
                    .catch(function (entryError) {
                        ErrorHandler.errorTranslate(entryError);
                    });
            }
            else {
                vm.entry = $stateParams.entry;
                loadAssetStatus();
            }
        }

        function loadAssetStatus(page) {
            if (!vm.assets) {
                vm.assets = [];
            }
            page ? null : page = 1;
            vm.assetStatusPromise = MANUAL_ENTRIES
                .getAssetStatus(vm.entryId, page, vm.entry.cabinets.length)
                .then(function (assetsStatus) {
                    vm.assets = vm.assets.concat(assetsStatus[PAGINATION.elements]);
                    updateMissingAssetsArray(assetsStatus[PAGINATION.elements]);
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        assetsStatus[PAGINATION.total] / vm.entry.cabinets.length
                    );
                })
                .catch(function (assetStatusError) {
                    ErrorHandler.errorTranslate(assetStatusError);
                });
        }

        //Called when entry initial load is performed or when more assets are loaded
        function updateMissingAssetsArray(assets) {
            angular.forEach(assets, function (asset) {
                if (asset.estado === 'Faltante') {
                    if (!vm.missingAssets) {
                        vm.missingAssets = [];
                    }
                    vm.missingAssets.push(asset.cabinet);
                }
            });
        }

        function closeEntry() {
            //Initializing empty array (backend requires empty array, even if no assets are missing)
            var closeElement = {
                cabinets_faltantes: []
            };
            //Concatenating the missing assets array if it exists
            if (vm.missingAssets) {
                closeElement.cabinets_faltantes = closeElement.cabinets_faltantes.concat(vm.missingAssets);
            }
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

        function entryHasPendingCabinets() {
            return vm.assets.some(function (asset) {
                return asset.estado === 'Pendiente';
            });
        }

        function addAsset(asset) {
            if (!vm.assets) {
                vm.assets = [];
            }
            //TODO: Add logic
            vm.loadingEntry = MANUAL_ENTRIES
                .addCabinet(vm.entryId, asset)
                .then(function () {
                    var assetToAdd = {
                        cabinet: asset.cabinet_id,
                        estado: asset.estado
                    };
                    vm.assets.unshift(assetToAdd);
                })
                .catch(function (addAssetErrorResponse) {
                    ErrorHandler.errorTranslate(addAssetErrorResponse);
                });
            //vm.assets.unshift(asset);
        }
    }
})();
