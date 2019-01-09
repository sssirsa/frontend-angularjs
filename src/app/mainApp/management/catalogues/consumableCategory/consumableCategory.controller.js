(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('consumableCategoryController',consumableCategoryController);

    function consumableCategoryController(URLS, Translate, OPTIONS, EnvironmentConfig)
    {

        var vm = this;

        const inventoryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogue.base + '/' + URLS.inventory.catalogue.consumable_category);

        vm.url = inventoryUrl;
        vm.kind = 'inventory';
        vm.name = Translate.translate('CONSUMABLE_CATEGORY.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('CONSUMABLE_CATEGORY.LABELS.TITLE');
        vm.createButtonText = Translate.translate('CONSUMABLE_CATEGORY.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('CONSUMABLE_CATEGORY.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('CONSUMABLE_CATEGORY.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('CONSUMABLE_CATEGORY.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('CONSUMABLE_CATEGORY.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_CATEGORY.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Categoría de Insumo'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_CATEGORY.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Categoría de Insumo'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('CONSUMABLE_CATEGORY.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Categoria de insumo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Categoria de insumo'
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
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Categoría de Insumo',
                    searchButton: Translate.translate('CONSUMABLE_CATEGORY.LABELS.TITLE'),
                    loadingText: 'Buscando Categoría de Insumo'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'nombre',
                        header: 'por Nombre',
                        label: 'Nombre',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'descripcion',
                        header: 'por Descripción',
                        label: 'Descripción',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'com_code',
                        header: 'por Código COM',
                        label: 'Código COM',
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
