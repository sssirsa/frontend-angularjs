(function () {
    'use strict';

    angular
        .module('app.mainApp.management.users')
        .controller('TemplatesController', TemplatesController);

    function TemplatesController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    ) {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.management.base
            + '/' + URLS.management.administration.base
            + '/' + URLS.management.catalogues.template;
        vm.name = Translate.translate('TEMPLATES.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('TEMPLATES.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('TEMPLATES.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('TEMPLATES.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('TEMPLATES.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('TEMPLATES.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('TEMPLATES.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('TEMPLATES.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('TEMPLATES.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('TEMPLATES.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'name',
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
                        model: 'description',
                        label: 'Descripción',
                        hint: 'Descripción breve de la plantilla',
                        required: true,
                        validations: {
                            regex: '.{1,200}',
                            errors: {
                                regex: 'La descripción debe contener máximo 200 caracteres',
                                required: 'La descripción es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'array_object',
                        model: 'permissions_to_add',
                        label: 'Permisos a añadir',
                        fields: [
                            {
                                type: 'catalog',
                                model: 'project',
                                label: 'Proyecto',
                                required: true,
                                catalog: {
                                    url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.management.base
                                        + '/' + URLS.management.administration.base
                                        + '/' + URLS.management.catalogues.project,
                                    name: 'Proyecto',
                                    model: 'id',
                                    option: 'verbose',
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
                                model: 'app',
                                label: 'Aplicación',
                                required: true,
                                catalog: {
                                    url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.management.base
                                        + '/' + URLS.management.administration.base
                                        + '/' + URLS.management.catalogues.app,
                                    name: 'Aplicación',
                                    model: 'id',
                                    option: 'verbose',
                                    query: 'project__id',
                                    requires: 'project',
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
                                model: 'module_id',
                                label: 'Módulo',
                                required: true,
                                catalog: {
                                    url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.management.base
                                        + '/' + URLS.management.administration.base
                                        + '/' + URLS.management.catalogues.module,
                                    name: 'Aplicación',
                                    model: 'id',
                                    option: 'verbose',
                                    query: 'app__id',
                                    requires: 'app',
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
                                type: 'object',
                                model: 'permission_data',
                                label: 'Acciones permitidas',
                                fields: [
                                    {
                                        type: 'boolean',
                                        model: 'GET',
                                        initial_value:false,
                                        label: '(GET) Ver y listar'
                                    },
                                    {
                                        type: 'boolean',
                                        model: 'POST',
                                        initial_value: false,
                                        label: '(POST) Crear'
                                    },
                                    {
                                        type: 'boolean',
                                        model: 'PUT',
                                        initial_value: false,
                                        label: '(PUT) Modificar'
                                    },
                                    {
                                        type: 'boolean',
                                        model: 'PATCH',
                                        initial_value: false,
                                        label: '(PATCH) Alterar'
                                    },
                                    {
                                        type: 'boolean',
                                        model: 'DELETE',
                                        initial_value: false,
                                        label: '(DELETE) Eliminar'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                dialog: {
                    title: 'Crear Plantilla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando plantilla'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Plantilla',
                    message: 'Confirme la eliminación de Plantilla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Plantilla'
                }
            },
            LIST: {
                elements: PAGINATION.elements,
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
                        model: 'name',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'description',
                        label: 'Descripcion'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Plantillas',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando plantillas...'
                },
                filters: [
                    {
                        type: 'icontains',
                        model: 'name',
                        header: 'por Nombre',
                        label: 'Nombre',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'icontains',
                        model: 'description',
                        header: 'por Descripción',
                        label: 'Descripción',
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
