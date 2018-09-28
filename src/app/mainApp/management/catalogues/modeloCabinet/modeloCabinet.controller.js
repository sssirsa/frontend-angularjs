(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('ModeloCabinetController', ModeloCabinetController);

    /* @ngInject */
    function ModeloCabinetController(URLS, Translate) {

        var vm = this;

        vm.url = URLS.modelo_cabinet;
        vm.kind = 'Web';
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
        vm.loadMoreButtonText = 'Cargar mas Modelo';
        vm.removeFilterButtonText = 'Qutar filtro';

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
                        model: 'marca',
                        label: 'Marca',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: URLS.marca,
                            kind: 'Web',
                            model: 'id',
                            option: 'descripcion',
                            name: 'Marca',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo',
                        label: 'Tipo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: URLS.tipo_equipo,
                            kind: 'Web',
                            model: 'id',
                            option: 'nombre',
                            name: 'Tipo'
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
                        model: 'marca',
                        label: 'Marca',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: URLS.marca,
                            kind: 'Web',
                            model: 'id',
                            option: 'descripcion',
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
                        model: 'tipo',
                        label: 'Tipo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: URLS.tipo_equipo,
                            kind: 'Web',
                            model: 'id',
                            bindTo: 'tipo',
                            option: 'nombre',
                            name: 'Tipo'
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
                        type: 'catalog',
                        model: 'tipo',
                        label: 'Tipo',
                        catalog: {
                            lazy: false,
                            url: URLS.tipo_equipo,
                            kind: 'Web',
                            model: 'id',
                            option: 'nombre'
                        }
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
                        type: 'catalog',
                        model: 'marca',
                        label: 'Marca',
                        catalog: {
                            lazy: false,
                            url: URLS.marca,
                            kind: 'Web',
                            model: 'id',
                            option: 'descripcion'
                        }
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
