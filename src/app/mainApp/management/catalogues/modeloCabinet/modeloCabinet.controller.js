(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('ModeloCabinetController', ModeloCabinetController);

    /* @ngInject */
    function ModeloCabinetController(URLS, Translate, EnvironmentConfig) {

        var vm = this;

        var managementUrl = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.cabinet_model);
        var brandUrl = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.cabinet_brand);
        var equipmentUrl = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.equipment_type);

        vm.url = managementUrl;
        vm.kind = 'Management';
        vm.name = Translate.translate('MODEL_CABINET.FORM.LABEL.MODEL');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Modelo';
        vm.createButtonText = 'Crear Modelo';
        vm.deleteButtonText = 'Borrar Modelo';
        vm.modifyButtonText = 'Editar Modelo';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar más Modelos';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Modelos';

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
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca_id',
                        label: 'Marca',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: brandUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Marca',
                            elements: 'results',
                            pagination: {
                                total: 'count',
                                limit: 'limit',
                                offset: 'offset',
                                pageSize: 20
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo_id',
                        label: 'Tipo Equipo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: equipmentUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Tipo',
                            elements: 'results',
                            pagination: {
                                total: 'count',
                                limit: 'limit',
                                offset: 'offset',
                                pageSize: 20
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'Descripción adicional para identificar el modelo',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true
                    },
                    {
                        type: 'text',
                        hint: 'Palabra clave a utilizar en la búsqueda del modelo de cabinet',
                        model: 'palabra_clave',
                        label: 'Palabra clave',
                        required: true
                    }
                ],
                dialog: {
                    title: 'Crear Modelo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Modelo'
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
                        type: 'catalog',
                        model: 'marca_id',
                        label: 'Marca',
                        bindTo: 'marca',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: brandUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Marca',
                            elements: 'results',
                            pagination: {
                                total: 'count',
                                limit: 'limit',
                                offset: 'offset',
                                pageSize: 20
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo_id',
                        bindTo: 'tipo',
                        label: 'Tipo Equipo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: equipmentUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Tipo',
                            elements: 'results',
                            pagination: {
                                total: 'count',
                                limit: 'limit',
                                offset: 'offset',
                                pageSize: 20
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'Descripción adicional para identificar el modelo',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true
                    },
                    {
                        type: 'text',
                        hint: 'Palabra clave a utilizar en la búsqueda del modelo de cabinet',
                        model: 'palabra_clave',
                        label: 'Palabra clave',
                        required: true
                    }
                ],
                dialog: {
                    title: 'Editar Modelo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Modelo'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Modelo',
                    message: 'Confirme la eliminación de Modelo',
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
                        model: 'nombre',
                        label: 'Palabra clave'
                    },
                    {
                        type: 'object_property',
                        model: 'marca__nombre',
                        label: 'Marca'
                    },
                    {
                        type: 'object_property',
                        model: 'tipo__descripcion',
                        label: 'Tipo Equipo'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Modelo',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Modelo'
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
                        model: 'palabra_clave',
                        header: 'por Palabra clave',
                        label: 'Palabra clave',
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
