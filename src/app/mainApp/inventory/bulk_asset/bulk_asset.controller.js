(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory.assets')
        .controller('bulkAssetInventoryController', BulkAssetInventoryController)

    function BulkAssetInventoryController(
        URLS,
        Translate,
        EnvironmentConfig,
        User
    ) {

        var vm = this;
        vm.showSubsidiarySelector;
        vm.subsidiary;

        const baseUrl = EnvironmentConfig.site.rest.api
            + '/' + URLS.inventory.base
            + '/' + URLS.inventory.management.base
            + '/' + URLS.inventory.management.bulk_asset_inventory;

        vm.url=baseUrl;

        vm.name = Translate.translate('BULK_ASSET_INVENTORY.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        //vm.searchButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.SEARCH');
        //vm.createButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.CREATE');
        //vm.deleteButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('BULK_ASSET_INVENTORY.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('BULK_ASSET_INVENTORY.LABELS.LOADING_MESSAGE');

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
                    title: Translate.translate('BULK_ASSET_INVENTORY.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET_INVENTORY.LABELS.MODIFYING')
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
                        label: 'Inventario',
                        fields: [
                            {
                                type: 'text',
                                model: 'cantidad',
                                label: 'Cantidad'
                            },
                            {
                                type: 'object_property',
                                model: 'sucursal__nombre',
                                label: 'Sucursal'
                            }
                        ],
                        nullOrEmpty:'Sin inventario'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        //Determining whether or not to show the Subsidiary selector.
        if (!User.getUser()['sucursal']) {
            vm.actions['PUT']
                .fields
                .push({
                    type: 'catalog',
                    model: 'sucursal_id',
                    label: 'Sucursal',
                    required: true,
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.subsidiary,
                        kind: 'Generic',
                        name: Translate.translate('BULK_ASSET_INVENTORY.LABELS.SUBSIDIARY'),
                        loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                        model: 'id',
                        option: 'nombre',
                        icon: 'fa fa-warehouse',
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
                    validations: {
                        errors: {
                            required: 'La sucursal es requerida'
                        }
                    }
                });
        }

        vm.onElementSelect = function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
