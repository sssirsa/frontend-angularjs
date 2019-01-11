(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('consumableModelController', consumableModelController);

    /* @ngInject */
    function consumableModelController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        const inventoryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogues.base + '/' + URLS.inventory.catalogues.consumable_model);
        const brandUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogues.base + '/' + URLS.inventory.catalogues.consumable_brand);


        vm.url = inventoryUrl;
        vm.kind = 'inventory';
        vm.name = Translate.translate('CONSUMABLE_MODEL.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('CONSUMABLE_MODEL.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('CONSUMABLE_MODEL.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('CONSUMABLE_MODEL.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('CONSUMABLE_MODEL.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('CONSUMABLE_MODEL.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('CONSUMABLE_MODEL.LABELS.LOADING_MESSAGE');

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
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca_id',
                        label: 'Marca insumo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: brandUrl,
                            kind: 'inventory',
                            model: 'id',
                            option: 'descripcion',
                            name: 'Marca',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_MODEL.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Modelo'
                }
            },
            PUT: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca_id',
                        label: 'Marca insumo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: brandUrl,
                            kind: 'inventory',
                            model: 'id',
                            option: 'descripcion',
                            name: 'Marca',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_MODEL.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Modelo'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('CONSUMABLE_MODEL.LABELS.DELETE'),
                    message: 'Confirme la eliminación de Modelo de insumo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Modelo'
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {
                    total: 'count'
                },
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'marca_descripcion',
                        label: 'Marca'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: Translate.translate('CONSUMABLE_MODEL.LABELS.SEARCH'),
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Modelo'
                },
                filters: [
                    {
                        type: 'istartswith',
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
