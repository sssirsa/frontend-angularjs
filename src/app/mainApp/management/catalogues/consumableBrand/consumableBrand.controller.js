(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('consumableBrandController',consumableBrandController);

    function consumableBrandController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        var inventoryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogues.base + '/' + URLS.inventory.catalogues.consumable_brand);

        vm.url = inventoryUrl;
        vm.kind = 'inventory';
        vm.name = Translate.translate('CONSUMABLE_BRAND.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('CONSUMABLE_BRAND.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('CONSUMABLE_BRAND.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('CONSUMABLE_BRAND.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('CONSUMABLE_BRAND.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('CONSUMABLE_BRAND.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('CONSUMABLE_BRAND.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_BRAND.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Marca de Insumo'
                }
            },
            PUT: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('CONSUMABLE_BRAND.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Marca de Insumo'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('CONSUMABLE_BRAND.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Marca de Insumo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Marca'
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
                        label: 'Nombre'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Marca',
                    searchButton: Translate.translate('CONSUMABLE_BRAND.LABELS.SEARCH'),
                    loadingText: 'Buscando Marca'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'descripcion',
                        header: 'por Nombre',
                        label: 'Nombre',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }

    }

})();
