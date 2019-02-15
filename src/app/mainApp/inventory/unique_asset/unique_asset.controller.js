(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory.assets')
        .controller('uniqueAssetInventoryController', UniqueAssetInventoryController)

    function UniqueAssetInventoryController(
        URLS,
        Translate,
        EnvironmentConfig,
        User
    ) {

        var vm = this;
        vm.showSubsidiarySelector;
        vm.subsidiary;
        vm.url;

        vm.catalogues = {
            subsidiary: {
                binding: 'sucursal_id',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.subsidiary,
                    kind: 'Generic',
                    name: Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.SUBSIDIARY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: 'id',
                    option: 'nombre'
                },
                hint: Translate.translate('UNIQUE_ASSET_INVENTORY.HINTS.SUBSIDIARY'),
                icon: 'fa fa-warehouse',
                required: true,
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
        };
        const baseUrl = EnvironmentConfig.site.rest.api
            + '/' + URLS.inventory.base
            + '/' + URLS.inventory.management.base
            + '/' + URLS.inventory.management.unique_asset_inventory;

        vm.name = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        //vm.searchButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.SEARCH');
        //vm.createButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.CREATE');
        //vm.deleteButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.LOADING_MESSAGE');

        //Actions meta
        vm.actions = {
            PUT: {
                id: 'id',
                fields: [
                    {
                        type: 'text',
                        model: 'cantidad',
                        label: 'Cantidad',
                        required: true,
                        hint: 'Cantidad del insumo',
                        validations: {
                            errors: {
                                required: 'La cantidad es requerida'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.MODIFYING')
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {},
                fields: [
                    {
                        type: 'text',
                        model: 'description',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'cost',
                        label: 'Costo'
                    },
                    {
                        type: 'object_property',
                        model: 'asset_model__marca__descripcion',
                        label: 'Marca'
                    },
                    {
                        type: 'object_property',
                        model: 'asset_model__descripcion',
                        label: 'Modelo'
                    },
                    {
                        type: 'array_object',
                        model: 'inventory',
                        display_fields: ['inventory__sucursal__nombre', 'inventory__cantidad'],
                        label: 'Cantidad'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        //Determining whether or not to show the Subsidiary selector.
        if (User.getUser().hasOwnProperty('sucursal')) {
            vm.showSubsidiarySelector = !User.getUser().sucursal;
            vm.subsidiary = User.getUser().sucursal;
            vm.url = baseUrl;
        }

        vm.onElementSelect = function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }

        vm.onSubsidiarySelect = function onSubsidiarySelect(element) {
            vm.subsidiary = element;
            vm.url = baseUrl
                + '?sucursal__id='
                + element;
        }

        vm.removeSubsidiary = function removeSubsidiary() {
            vm.subsidiary = null;
            vm.url = null;
        }
    }

})();
