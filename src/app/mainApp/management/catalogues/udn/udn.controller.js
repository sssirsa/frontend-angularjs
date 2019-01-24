(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('UDNController',UDNController);

    function UDNController(URLS, Translate, OPTIONS, EnvironmentConfig)
    {

        var vm = this;

        const entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.udn);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('UDN_CATALOG.title');
        vm.options = OPTIONS.zone;

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar UDN';
        vm.createButtonText = 'Crear UDN';
        vm.deleteButtonText = 'Borrar UDN';
        vm.modifyButtonText = 'Editar UDN';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas UDN';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando UDN';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'options',
                        model: 'zona',
                        label: 'Zona',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        },
                        options: {
                            model: 'value',
                            option: 'value',
                            elements: vm.options
                        }
                    },
                    {
                        type: 'text',
                        model: 'agencia',
                        label: 'Agencia',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'centro',
                        label: 'Centro',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Dirección',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'tel',
                        model: 'telefono',
                        label: 'Telefono',
                        required: true,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,12}",
                            errors: {
                                regex: 'El número no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear UDN',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando UDN'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'options',
                        model: 'zona',
                        label: 'Zona',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        options: {
                            model: 'value',
                            option: 'value',
                            elements: vm.options
                        }
                    },
                    {
                        type: 'text',
                        model: 'agencia',
                        label: 'Agencia',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'centro',
                        label: 'Centro',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Dirección',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'tel',
                        model: 'telefono',
                        label: 'Telefono',
                        required: true,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,12}",
                            errors: {
                                regex: 'El número no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar UDN',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando UDN'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar UDN',
                    message: 'Confirme la eliminación de UDN',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando UDN'
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
                        model: 'zona',
                        label: 'Zona'
                    },
                    {
                        type: 'text',
                        model: 'agencia',
                        label: 'Agencia'
                    },
                    {
                        type: 'text',
                        model: 'centro',
                        label: 'Centro'
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Dirección'
                    },
                    {
                        type: 'tel',
                        model: 'telefono',
                        label: 'Telefono'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de UDN',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando UDN'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'zona',
                        header: 'por Zona',
                        label: 'Zona',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'agencia',
                        header: 'por Agencia',
                        label: 'Agencia',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'centro',
                        header: 'por Centro',
                        label: 'Centro',
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
