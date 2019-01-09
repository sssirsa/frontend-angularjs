(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('TipoTransporteController',TipoTransporteController);

    function TipoTransporteController(URLS, Translate, EnvironmentConfig)
    {
        var vm = this;

        const entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.entries.catalogue.base + '/' + URLS.entries_departures.entries.catalogue.transport_type);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('Transport_Kind.title');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Transporte';
        vm.createButtonText = 'Crear Transporte';
        vm.deleteButtonText = 'Borrar Transporte';
        vm.modifyButtonText = 'Editar Transporte';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas tipos transporte';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Transportes';

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
                                required: 'El nombre es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Transporte'
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
                                required: 'El nombre es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Transporte'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Transporte',
                    message: 'Confirme la eliminación del transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Transporte'
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
                    title: 'Busqueda de Transporte',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Transporte'
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
