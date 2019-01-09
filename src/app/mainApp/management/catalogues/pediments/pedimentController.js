(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('pedimentController',pedimentController);

    function pedimentController(URLS, Translate, EnvironmentConfig)
    {
        var vm = this;

        const entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.entries.catalogue.base + '/' + URLS.entries_departures.entries.catalogue.pediments);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('PEDIMENT.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('PEDIMENT.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('PEDIMENT.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('PEDIMENT.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('PEDIMENT.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('PEDIMENT.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('PEDIMENT.LABELS.LOADING_MESSAGE');

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
                    title: 'Crear Pedimento',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Pedimento'
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
                    title: 'Editar Pedimento',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Pedimento'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Pedimento',
                    message: 'Confirme la eliminación del Pedimento',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Pedimento'
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
                    title: 'Busqueda de Pedimento',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Pedimento'
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
        }

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }

    }

})();
