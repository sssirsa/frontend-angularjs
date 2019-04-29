/**
 * Created by franciscojaviercerdamartinez on 3/20/19.
 */
/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('uniqueAsset', {
            templateUrl: 'app/mainApp/technical_service/components/uniqueAsset/uniqueAsset.tmpl.html',
            controller: uniqueAssetController,
            bindings: {
                uniqueAssetLoaded: '&',
                uniqueAssetSelected: '<',
                sucursal: '<'

            }
        });
    function uniqueAssetController(Translate, ErrorHandler, uniqueAssetProvider, EnvironmentConfig, $mdDialog, URLS, $log) {
        var vm = this;
        vm.notDetected = [];
        vm.unique_asset_list = [];
        vm.selected_unique_assets = [];
        vm.search_unique_asset = search_unique_asset;
        vm.removePossibleUniqueAsset = removePossibleUniqueAsset;
        vm.onChange = onChange;
        vm.createUnique = createUnique;

        function removePossibleUniqueAsset(element) {
            var index;
            for (index = 0; index < vm.notDetected.length; ++index) {
                if (vm.notDetected[index] === element) {
                    vm.notDetected.splice(index, 1);
                }
            }
        }

        function getDuplicity(unique_asset) {
            $log.debug(unique_asset);
            var index;
            for (index = 0; index < vm.selected_unique_assets.length; ++index) {
                if (vm.selected_unique_assets[index].no_serie === unique_asset.no_serie) {
                    vm.selected_unique_assets.splice(index, 1);
                }
            }
        }

        function deleteElement(unique_asset) {
            var index;
            for (index = 0; index < vm.selected_unique_assets.length; ++index) {
                if (vm.selected_unique_assets[index].no_serie === unique_asset.no_serie) {
                    vm.selected_unique_assets.splice(index, 1);
                }
            }
            vm.uniqueAssetLoaded({element: vm.selected_unique_assets});
        }

        function addElement(unique_asset) {
            getDuplicity(unique_asset);
            vm.selected_unique_assets.push(unique_asset);
            vm.uniqueAssetLoaded({element: vm.selected_unique_assets});

        }

        function onChange(unique_asset) {
            // $log.debug(unique_asset)
            if (unique_asset.used) {
                addElement(unique_asset);
            }
            else {
                deleteElement(unique_asset);
            }
            // $log.debug("insumos Usados:")
            // $log.debug(vm.selected_unique_assets);

        }


        function search_unique_asset() {
            var promiseUniqueAssets = uniqueAssetProvider.getUniqueAssetsList(vm.barcode);
            promiseUniqueAssets.then(function (uniqueAssetsList) {
                if (uniqueAssetsList.results.length > 0) {
                    var i;
                    for (i = 0; i < uniqueAssetsList.results.length; ++i) {
                        getDuplicityOptions(uniqueAssetsList.results[i]);
                        vm.unique_asset_list.push(uniqueAssetsList.results[i]);
                    }
                }
                else {
                    vm.notDetected.push(vm.barcode);
                }
                // $log.debug(vm.unique_asset_list);
                // $log.debug(vm.notDetected);
            }).catch(function (errormsg) {
                $log.debug(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function getDuplicityOptions(unique_asset) {
            $log.debug(unique_asset);
            var index;
            for (index = 0; index < vm.unique_asset_list.length; ++index) {
                if (vm.unique_asset_list[index].no_serie === unique_asset.no_serie) {
                    vm.unique_asset_list.splice(index, 1);
                }
            }
        }

        function createUnique(element) {
            vm.meta_creation = {
                fields: [
                    {
                        type: 'catalog',
                        model: 'catalogo_insumo_unico_id',
                        label: Translate.translate('UNIQUE_ASSET_COMPONENT.CATALOG_UNIQUE_ASSET_BRANCH'),
                        required: true,
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.inventory.base
                            + '/' + URLS.management.base
                            + '/unique_asset_branch',
                            name: Translate.translate('UNIQUE_ASSET_COMPONENT.CATALOG_UNIQUE_ASSET_BRANCH'),
                            model: 'id',
                            option: 'description',
                            elements: 'results',//elementos del promise donde iterar
                            showModel: true,//mostrar model y option
                            pagination: {}//manejo de Paginado
                        }
                    },
                    {
                        type: 'text',
                        model: 'no_serie',
                        initial_value: element,
                        lock: true,
                        label: Translate.translate('UNIQUE_ASSET_COMPONENT.BARCODE')
                    },
                    {
                        type: 'catalog',
                        model: 'sucursal_id',
                        initial_value: vm.sucursal.id,
                        label: Translate.translate('UNIQUE_ASSET_COMPONENT.SUBSIDIARY'),
                        required: true,
                        lock: true
                    }
                ]
            };
            vm.url = EnvironmentConfig.site.rest.api
                + '/' + URLS.inventory.base
                + '/' + URLS.management.base
                + '/unique_asset';
            vm.actions = {
                POST: {

                    fields: vm.meta_creation.fields,
                    dialog: {
                        title: Translate.translate('UNIQUE_ASSET_COMPONENT.CREATE_UNIQUE'),
                        okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                        cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                        loading: 'Guardando Acción'
                    },
                    url: vm.url
                }
            };
            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: vm.actions['POST'].dialog,
                    id: vm.actions['POST'].id,
                    fields: vm.actions['POST'].fields,
                    element: vm.actions['POST'].object,
                    url: vm.actions['POST'].url
                }
            }).then(function () {
                ErrorHandler.successCreation();
                removePossibleUniqueAsset(element);
                search_unique_asset(element);


            }).catch(function (errorDelete) {
                if (errorDelete) {
                    ErrorHandler.errorTranslate(errorDelete);
                }

            });


        }
    }
})();
