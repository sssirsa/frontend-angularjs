(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('LineaTransporteController', LineaTransporteController);

    /* @ngInject */
    function LineaTransporteController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        var entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.transport_line);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('TRANSPORT_LINE.FORM.LABEL.TRANSPORT_LINE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Linea de Transporte';
        vm.createButtonText = 'Crear Linea de Transporte';
        vm.deleteButtonText = 'Borrar Linea de Transporte';
        vm.modifyButtonText = 'Editar Linea de Transporte';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas lineas de transporte';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Linea de Transporte';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'razon_social',
                        label: 'Razon social',
                        required: true,
                        validations: {
                            errors: {
                                required: 'La razón social es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion',
                        required: false
                    },
                    {
                        type: 'array',
                        model: 'telefonos',
                        label: 'Telefonos',
                        required: false,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,10}",
                            errors: {
                                regex: 'El número no tiene un formato correcto'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'responsable',
                        label: 'Responsable',
                        required: false
                    }
                ],
                dialog: {
                    title: 'Crear Linea de Transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Linea de Transporte'
                }
            },
            PUT: {
                id: 'id',
                fields: [
                    {
                        type: 'text',
                        model: 'razon_social',
                        label: 'Razon social',
                        required: true,
                        validations: {
                            errors: {
                                required: 'La razón social es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion',
                        required: false
                    },
                    {
                        type: 'array',
                        model: 'telefonos',
                        label: 'Telefonos',
                        required: false,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,10}",
                            errors: {
                                regex: 'El número no tiene un formato correcto'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'responsable',
                        label: 'Responsable',
                        required: false
                    }
                ],
                dialog: {
                    title: 'Editar Linea de Transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Linea de Transporte'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Linea de Transporte',
                    message: 'Confirme la eliminación de la Linea de Transporte',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Linea de Transporte'
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
                        model: 'razon_social',
                        label: 'Razon social'
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion'
                    },
                    {
                        type: 'number',
                        model: 'telefonos',
                        label: 'Telefonos'
                    },
                    {
                        type: 'text',
                        model: 'responsable',
                        label: 'Responsable'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Linea de Transporte',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Linea de Transporte'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'razon_social',
                        header: 'por Razón Social',
                        label: 'Razón social',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'responsable',
                        header: 'por Responsable',
                        label: 'Responsable',
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
