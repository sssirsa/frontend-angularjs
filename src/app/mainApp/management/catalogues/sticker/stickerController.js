(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('StickerController',StickerController);

    function StickerController(URLS, Translate, EnvironmentConfig)
    {
        var vm = this;

        var entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.sticker);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('STICKER.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STICKER.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('STICKER.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('STICKER.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('STICKER.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('STICKER.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('STICKER.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripcion',
                        required: true,
                        validations: {
                            errors: {
                                required: 'La descripción es obligatoria'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Sticker',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Sticker'
                }
            },
            PUT: {
                id: 'id',
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripcion',
                        required: true,
                        validations: {
                            errors: {
                                required: 'La descripción es obligatoria'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Sticker',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Sticker'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Sticker',
                    message: 'Confirme la eliminación del Sticker',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Sticker'
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
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Sticker',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Sticker'
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

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }

    }

})();
