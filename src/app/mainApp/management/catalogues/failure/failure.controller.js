(function () {
    'use strict';

    angular
        .module('app.mainApp.technical_service')
        .controller('failureCatalogController', FailureCatalogController);

    function FailureCatalogController(
        URLS,
        Translate,
        EnvironmentConfig
    ) {

        var vm = this;

        const technicalUrl = EnvironmentConfig.site.rest.api
            + '/' + URLS.technical_service.base
            + '/' + URLS.technical_service.catalogues.base
            + '/' + URLS.technical_service.catalogues.failure;

        vm.url = technicalUrl;
        vm.name = 'Fallas';

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('ACTION.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('ACTION.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('ACTION.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('ACTION.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('ACTION.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('ACTION.LABELS.LOADING_MESSAGE');

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
                        hint: 'Nombre de la falla',
                        validations: {
                            errors: {
                                required: 'El nombre es requerido.'
                            }
                        }
                    },
                    {
                        type: 'boolean',
                        model: 'obsoleto',
                        label: 'Obsoletizar',
                        hint: 'Active si esta falla obsoletiza el cabinet'
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        hint: 'Descripción breve de la falla.',
                        validations: {
                            errors: {
                                required: 'El nombre es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'clasificador_falla_id',
                        hint: 'Selecciona un tipo de falla',
                        catalog: {
                            model: 'id',
                            option: 'nombre',
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.failure_type,
                            pagination: {},
                            elements: 'results',
                            name: 'Tipo de falla',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog_array',
                        model: 'etapas_posibles_id',
                        catalog: {
                            model: 'id',
                            option: 'nombre',
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.failure_type,
                            pagination: {},
                            elements: 'results',
                            name: 'Etapas posibles',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Falla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Falla'
                }
            },
            PUT: {
                id: 'com_code',
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
                        required: true,
                        hint: 'Nombre de la falla',
                        validations: {
                            errors: {
                                required: 'El nombre es requerido.'
                            }
                        }
                    },
                    {
                        type: 'boolean',
                        model: 'obsoleto',
                        label: 'Obsoletizar',
                        hint: 'Active si esta falla obsoletiza el cabinet'
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        hint: 'Descripción breve de la falla.',
                        validations: {
                            errors: {
                                required: 'El nombre es requerido.'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'clasificador_falla_id',
                        bindTo: 'clasificador_falla',
                        hint: 'Selecciona un tipo de falla',
                        catalog: {
                            model: 'id',
                            option: 'nombre',
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.failure_type,
                            pagination: {},
                            elements: 'results',
                            name: 'Tipo de falla',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog_array',
                        model: 'etapas_posibles_id',
                        bindTo: 'etapas_posibles',
                        catalog: {
                            model: 'id',
                            option: 'nombre',
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.failure_type,
                            pagination: {},
                            elements: 'results',
                            name: 'Etapas posibles',
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Modificar Falla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Falla'
                }
            },
            DELETE: {
                id: 'com_code',
                dialog: {
                    title: 'Eliminar Falla',
                    message: 'Confirme la eliminación de la Falla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Falla'
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
                        model: 'com_code',
                        label: 'Código COM'
                    },
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
                    title: 'Búsqueda de Acción',
                    searchButton: Translate.translate('ACTION.LABELS.SEARCH'),
                    loadingText: 'Buscando Acción'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'com_code',
                        header: 'por Código COM',
                        label: 'Código',
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
