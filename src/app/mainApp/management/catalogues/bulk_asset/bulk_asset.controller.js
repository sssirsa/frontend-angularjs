(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('bulkAssetController', BulkAssetController)

    function BulkAssetController(
        URLS,
        Translate,
        EnvironmentConfig
    ) {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.inventory.base
            + '/' + URLS.inventory.catalogues.base
            + '/' + URLS.inventory.catalogues.bulk_asset,
            vm.name = Translate.translate('BULK_ASSET.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('BULK_ASSET.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('BULK_ASSET.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('BULK_ASSET.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('BULK_ASSET.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('BULK_ASSET.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('BULK_ASSET.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('BULK_ASSET.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('BULK_ASSET.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('BULK_ASSET.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        hint: 'Descripción del insumo',
                        validations: {
                            regex: '.{1,200}',
                            errors: {
                                regex: 'La descripción debe contener máximo 200 caracteres',
                                required: 'La descripción es requerida'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'costo',
                        label: 'Costo',
                        required: true,
                        hint: 'Costo actual del insumo (máximo 2 decimales)',
                        validations: {
                            //regex: '(\d+)(\.(\d{1,2}))*',
                            errors: {
                                regex: 'Formato de costo inválido',
                                required: 'El costo es requerido'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca_insumo',
                        label: 'Marca del insumo',
                        hint: 'Seleccione para listar los modelos',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_brand,
                            name: 'Marca del insumo',
                            model: 'id',
                            option: 'descripcion',
                            loadMoreButtonText: 'Cargar mas...',
                            elements: 'results'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'modelo_insumo_id',
                        label: 'Modelo del insumo',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_model,
                            query: '?marca__id=',
                            requires: 'marca_insumo',
                            name: 'Modelo del insumo',
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'proveedor_id',
                        label: 'Proveedor del insumo',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.supplier,
                            name: 'Proveedor del insumo',
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'unidad_id',
                        label: 'Unidad del insumo',
                        hint: 'Unidad en la que el insumo es medido',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_unit,
                            name: 'Unidad del insumo',
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'categoria_insumo_id',
                        label: 'Categoría del insumo',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_category,
                            name: 'Categoría del insumo',
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo_componente_id',
                        label: 'Tipo de componente',
                        hint: 'Unidad en la que el insumo es medido',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.component_type,
                            name: 'Tipo de componente',
                            model: 'com_code',
                            showModel: true,
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('BULK_ASSET.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET.LABELS.CREATING')
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        hint: 'Descripción del insumo',
                        validations: {
                            regex: '.{1,200}',
                            errors: {
                                regex: 'La descripción debe contener máximo 200 caracteres',
                                required: 'La descripción es requerida'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'costo',
                        label: 'Costo',
                        required: true,
                        hint: 'Costo actual del insumo (máximo 2 decimales)',
                        validations: {
                            //regex: '\d+(\.(\d{1,2}))*',
                            errors: {
                                regex: 'Formato de costo inválido',
                                required: 'El costo es requerido'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca_insumo',
                        label: 'Marca del insumo',
                        hint: 'Seleccione para listar los modelos',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_brand,
                            name: 'Marca del insumo',
                            model: 'id',
                            option: 'descripcion',
                            loadMoreButtonText: 'Cargar mas...',
                            elements: 'results'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'modelo_insumo_id',
                        label: 'Modelo del insumo',
                        bindTo: 'modelo_insumo',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_model,
                            query: '?marca__id=',
                            requires: 'marca_insumo',
                            name: 'Modelo del insumo',
                            model: 'id',
                            option: 'descripcion',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'proveedor_id',
                        label: 'Proveedor del insumo',
                        bindTo: 'proveedor',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.supplier,
                            name: 'Proveedor del insumo',
                            model: 'id',
                            option: 'razon_social',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'unidad_id',
                        label: 'Unidad del insumo',
                        bindTo: 'unidad',
                        hint: 'Unidad en la que el insumo es medido',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_unit,
                            name: 'Unidad del insumo',
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'categoria_insumo_id',
                        label: 'Categoría del insumo',
                        bindTo: 'categoria_insumo',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.consumable_category,
                            name: 'Categoría del insumo',
                            model: 'id',
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo_componente_id',
                        label: 'Tipo de componente',
                        hint: 'Unidad en la que el insumo es medido',
                        bindTo: 'tipo_componente',
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.component_type,
                            name: 'Tipo de componente',
                            model: 'com_code',
                            showModel: true,
                            option: 'nombre',
                            elements: 'results',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count',
                            next: 'next'
                        },
                        required: true,
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('BULK_ASSET.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET.LABELS.MODIFYING')
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('BULK_ASSET.LABELS.DELETE'),
                    message: Translate.translate('BULK_ASSET.LABELS.DELETE_CONFIRM'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET.LABELS.DELETING')
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {},
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'costo',
                        label: 'Costo'
                    },
                    {
                        type: 'object',
                        model: 'modelo_insumo__marca__descripcion',
                        label: 'Marca'
                    },
                    {
                        type: 'object',
                        model: 'modelo_insumo__descripcion',
                        label: 'Modelo'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: Translate.translate('BULK_ASSET.LABELS.SEARCH'),
                    searchButton: Translate.translate('MAIN.BUTTONS.SEARCH'),
                    loadingText: Translate.translate('BULK_ASSET.LABELS.SEARCHING')
                },
                filters: [
                    {
                        type: 'icontains',
                        model: 'descripcion',
                        header: 'por Descripción',
                        label: 'Descripción',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        };

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
