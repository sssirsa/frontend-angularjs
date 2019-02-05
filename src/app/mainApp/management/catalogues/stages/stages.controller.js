(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('stagesController', StagesController)

    function StagesController(
        URLS,
        Translate,
        EnvironmentConfig
    ) {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.technical_service.base
            + '/' + URLS.technical_service.catalogues.base
            + '/' + URLS.technical_service.catalogues.stage;
        vm.kind = 'Mobile';
        vm.name = Translate.translate('STAGES.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STAGES.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('STAGES.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('STAGES.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('STAGES.LABELS.MODIFY');
        vm.nextButtonText = 'STAGES.LABELS.NEXT';
        vm.previousButtonText = 'STAGES.LABELS.PREVIOUS';
        vm.loadMoreButtonText = Translate.translate('STAGES.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'STAGES.LABELS.REMOVE_FILTER';

        //Messages
        vm.loadingMessage = Translate.translate('STAGES.LABELS.LOADING_MESSAGE');

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
                                required: 'El nombre es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        hint: '(Opcional) Descripción breve de la etapa',
                        validations: {
                            regex: '.{1,200}',
                            errors: {
                                regex: 'La descripción debe contener máximo 200 caracteres'
                            }
                        }
                    },
                    {
                        type: 'options',
                        model: 'tipo_etapa',
                        label: 'Tipo de Etapa',
                        required: true,
                        hint:'Para etapa genérica seleccione "Reparación"',
                        options: {
                            model: 'value',
                            option: 'display_name',
                            elements: URLS.technical_service.choices.tipo_etapa
                        }
                    },
                    {
                        type: 'catalog_array',
                        model: 'acciones_id',
                        label: 'Acciones',
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.action,
                            model: 'com_code',
                            option: 'descripcion',
                            name: 'Acciones',
                            elements: 'results',
                            pagination: {}
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog_array',
                        model: 'etapas_siguientes_id',
                        label: 'Etapas Siguientes',
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.stage,
                            model: 'id',
                            option: 'nombre',
                            name: 'Etapas siguientes',
                            elements: 'results',
                            pagination: {}
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'etapas_defecto',
                        label: 'Etapas Defecto',
                        hint: 'La etapa defecto debe estar en el listado de etapas siguientes',
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.stage,
                            model: 'id',
                            option: 'nombre',
                            name: 'Etapa siguiente por defecto',
                            elements: 'results',
                            pagination: {}
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Etapa'
                }
            },
            PUT: {
                fields: [],
                dialog: {
                    title: 'Editar Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Actualizando Etapa'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Etapa',
                    message: 'Confirme la eliminación de Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Etapa'
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {},
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'tipo_etapa',
                        label: 'Tipo de Etapa'
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
                    title: 'Búsqueda de Etapas',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando etapas...'
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
                        model: 'tipo_etapa',
                        header: 'por Tipo de Etapa',
                        label: 'Tipo de Etapa',
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
