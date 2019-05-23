(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('SucursalController', SucursalController);

    /* @ngInject */
    function SucursalController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    ) {
        var vm = this;

        var managementUrl =  EnvironmentConfig.site.rest.api
            + '/' + URLS.management.base
            + '/'
            + URLS.management.catalogues.base
            + '/' + URLS.management.catalogues.subsidiary;

        vm.url = managementUrl;
        vm.kind = 'management';
        vm.name = Translate.translate('SUCURSAL.FORM.LABEL.BRANCH');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Sucursal';
        vm.createButtonText = 'Crear Sucursal';
        vm.deleteButtonText = 'Borrar Sucursal';
        vm.modifyButtonText = 'Editar Sucursal';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Sucursal';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Sucursal';

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
                        model: 'direccion',
                        label: 'Dirección',
                        required: false
                    },
                    {
                        type: 'array',
                        model: 'telefonos',
                        label: 'Telefonos',
                        required: false,
                        hint:'Presione ENTER al terminar de capturar el teléfono',
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
                    title: 'Crear Sucursal',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Sucursal'
                }
            },
            PUT: {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
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
                        required: false
                    },
                    {
                        type: 'array',
                        model: 'telefonos',
                        label: 'Telefonos',
                        required: false,
                        hint: 'Presione ENTER al terminar de capturar el teléfono',
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
                    title: 'Editar Sucursal',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Sucursal'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Sucursal',
                    message: 'Confirme la eliminación de Sucursal',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Sucursal'
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
                },
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Dirección'
                    },
                    {
                        type: 'array',
                        model: 'telefonos',
                        label: 'Telefonos',
                        nullOrEmpty:'Sin teléfono'
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
                    title: 'Búsqueda de Sucursal',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Sucursal'
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
