(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('StagesController', StagesController);

    function StagesController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION,
        User
    ) {

        var vm = this;

        vm.userSubsidiary;
        vm.userAgency;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.technical_service.base
            + '/' + URLS.technical_service.catalogues.base
            + '/' + URLS.technical_service.catalogues.stage;
        vm.name = Translate.translate('STAGES.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STAGES.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('STAGES.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('STAGES.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('STAGES.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('STAGES.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('STAGES.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('STAGES.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('STAGES.LABELS.REMOVE_FILTER');

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
                        lock: true,
                        initial_value: 'Reparacion',
                        hint: 'Campo no editable',
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'etapa_defecto_id',
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
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
                        lock: true,
                        hint: 'Campo no editable',
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
                        bindTo: 'acciones',
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog_array',
                        model: 'etapas_siguientes_id',
                        bindTo: 'etapas_siguientes',
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'etapa_defecto_id',
                        label: 'Etapas Defecto',
                        bindTo: 'etapa_defecto',
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
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    }
                ],
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
                mode: PAGINATION.mode,
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

        function init() {
            var user = User.getUser();

            vm.userAgency = user.udn;
            vm.userSubsidiary = user.sucursal;

            //Show subsidiary selector if user has no subsidiary
            if (!vm.userAgency && !vm.userSubsidiary) {
                var subsidiaryCatalogPost =
                    {
                        type: 'catalog',
                        model: 'sucursal_id',
                        label: 'Sucursal',
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            model: 'id',
                            option: 'nombre',
                            name: 'Sucursal',
                            elements: PAGINATION.elements,
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    };
                var subsidiaryCatalogPut =
                    {
                        type: 'catalog',
                        model: 'sucursal_id',
                        bindTo:'sucursal',
                        label: 'Sucursal',
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.subsidiary,
                            model: 'id',
                            option: 'nombre',
                            name: 'Sucursal',
                            elements: PAGINATION.elements,
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    };
                vm.actions.POST.fields.push(subsidiaryCatalogPost);
                vm.actions.PUT.fields.push(subsidiaryCatalogPut);
            }
        }
        init();

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }

})();
