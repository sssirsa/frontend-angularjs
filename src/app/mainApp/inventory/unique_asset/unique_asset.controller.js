(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory.assets')
        .controller('uniqueAssetInventoryController', UniqueAssetInventoryController);

    function UniqueAssetInventoryController(
        URLS,
        Translate,
        EnvironmentConfig,
        User,
        PAGINATION
    ) {

        var vm = this;
        vm.showSubsidiarySelector;
        vm.subsidiary;

        var baseUrl = EnvironmentConfig.site.rest.api
            + '/' + URLS.inventory.base
            + '/' + URLS.inventory.management.base
            + '/' + URLS.inventory.management.unique_asset_inventory;
            
        vm.url=baseUrl;

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
                mode: PAGINATION.mode,
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
                },
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
                        nullOrEmpty: 'Sin inventario'
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
                        
                        name: Translate.translate('UNIQUE_ASSET_INVENTORY.LABELS.SUBSIDIARY'),
                        loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                        model: 'id',
                        option: 'nombre',
                        icon: 'fa fa-warehouse',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
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

        vm.onElementSelect = function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        };

    }

})();
