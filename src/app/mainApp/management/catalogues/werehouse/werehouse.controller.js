(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('werehouseController',werehouseController);

    function werehouseController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.werehouse);

        const subsidiaryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.subsidiary);

        vm.url = managementUrl;
        vm.kind = 'management';
        vm.name = Translate.translate('WEREHOUSE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('WEREHOUSE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('WEREHOUSE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('WEREHOUSE.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('WEREHOUSE.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('WEREHOUSE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('WEREHOUSE.LABELS.LOADING_MESSAGE');

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
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'pasillo_max',
                        label: 'No. Máximo de Pasillos',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'estiba_max',
                        label: 'No. Máximo de Estibas',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'No. de cabinets',
                        model: 'profundidad_max',
                        label: 'Profundidad Máxima',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'sucursal_id',
                        label: 'Sucursal',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: subsidiaryUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Sucursal',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                ],
                dialog: {
                    title: Translate.translate('WEREHOUSE.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Bodega'
                }
            },
            PUT: {
                id:'id',
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
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'pasillo_max',
                        label: 'No. Máximo de Pasillos',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'estiba_max',
                        label: 'No. Máximo de Estibas',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'No. de cabinets',
                        model: 'profundidad_max',
                        label: 'Profundidad Máxima',
                        required: true,
                        validations: {
                            regex: "[0-9]{1,10}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'sucursal_id',
                        label: 'Sucursal',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: subsidiaryUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Sucursal',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                ],
                dialog: {
                    title: Translate.translate('WEREHOUSE.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Bodega'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('WEREHOUSE.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Bodega',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Bodega'
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
                        model: 'pasillo_max',
                        label: 'No. Máximo de Pasillos'
                    },
                    {
                        type: 'text',
                        model: 'estiba_max',
                        label: 'No. Máximo de Estibas'
                    },
                    {
                        type: 'text',
                        model: 'profundidad_max',
                        label: 'Profundidad Máxima'
                    },
                    {
                        type: 'text',
                        model: 'sucursal_nombre',
                        label: 'Sucursal'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Bodega',
                    searchButton: Translate.translate('WEREHOUSE.LABELS.SEARCH'),
                    loadingText: 'Buscando Bodega'
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
                        model: 'sucursal_nombre',
                        header: 'por Sucursal',
                        label: 'Sucursal',
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
