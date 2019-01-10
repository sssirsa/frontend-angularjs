(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('positionController',positionController);

    function positionController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.position);

        const werehouseUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.werehouse);

        vm.url = managementUrl;
        vm.kind = 'management';
        vm.name = Translate.translate('POSITION.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('POSITION.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('POSITION.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('POSITION.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('POSITION.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('POSITION.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('POSITION.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'pasillo',
                        label: 'Pasillo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'estiba',
                        label: 'Estiba',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'No. de cabinets',
                        model: 'profundidad',
                        label: 'Profundidad',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'bodega_id',
                        label: 'Bodega',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: werehouseUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Bodega',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        }
                    },
                ],
                dialog: {
                    title: Translate.translate('POSITION.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Posicionamiento'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'pasillo',
                        label: 'Pasillo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'estiba',
                        label: 'Estiba',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        hint: 'No. de cabinets',
                        model: 'profundidad',
                        label: 'Profundidad',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'bodega_id',
                        label: 'Bodega',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: werehouseUrl,
                            kind: 'management',
                            model: 'id',
                            option: 'nombre',
                            name: 'Bodega',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        }
                    },
                ],
                dialog: {
                    title: Translate.translate('POSITION.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Posicionamiento'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('POSITION.LABELS.DELETE'),
                    message: 'Confirme la eliminación del Posicionamiento',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Posicionamiento'
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
                        model: 'pasillo',
                        label: 'Pasillo'
                    },
                    {
                        type: 'text',
                        model: 'estiba',
                        label: 'Estiba'
                    },
                    {
                        type: 'text',
                        model: 'profundidad',
                        label: 'Profundidad'
                    },
                    {
                        type: 'text',
                        model: 'bodega_nombre',
                        label: 'Bodega'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Posicionamiento',
                    searchButton: Translate.translate('POSITION.LABELS.SEARCH'),
                    loadingText: 'Buscando Posicionamiento'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'pasillo',
                        header: 'por Pasillo',
                        label: 'Pasillo',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'estiba',
                        header: 'por Estiba',
                        label: 'Estiba',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'profundidad',
                        header: 'por Profundidad',
                        label: 'Profundidad',
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
