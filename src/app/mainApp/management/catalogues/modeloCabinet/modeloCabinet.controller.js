(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('ModeloCabinetController', ModeloCabinetController);

    /* @ngInject */
    function ModeloCabinetController(URLS, Translate, EnvironmentConfig) {

        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.cabinet_model);
        const brandUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.cabinet_brand);
        const equipmentUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.equipment_type);

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
                                total: 'count'
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
                                total: 'count'
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
                            bindTo: 'marca',
                            pagination: {
                                total: 'count'
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
                                total: 'count'
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
                        type: 'text',
                        model: 'marca_nombre',
                        label: 'Marca',
                    },
                    {
                        type: 'text',
                        model: 'tipo_nombre',
                        label: 'Tipo',
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Modelo',
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

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
