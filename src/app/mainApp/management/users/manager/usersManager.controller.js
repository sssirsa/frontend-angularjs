(function () {
    'use strict';

    angular
        .module('app.mainApp.management.users')
        .controller('usersManagementController', UsersManagementController);

    function UsersManagementController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION,
        QUERIES
    ) {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.management.base
            + '/' + URLS.management.administration.base
            + '/' + URLS.management.administration.person
            + '?' + QUERIES.user.by_existing_email;

        vm.name = Translate.translate('USERS.MANAGE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';
        vm.noResultsText = Translate.translate('USERS.MANAGE.LABELS.NO_RESULTS');

        //Button labels
        vm.searchButtonText = Translate.translate('USERS.MANAGE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('USERS.MANAGE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('USERS.MANAGE.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('USERS.MANAGE.LABELS.MODIFY');
        vm.nextButtonText = Translate.translate('USERS.MANAGE.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('USERS.MANAGE.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('USERS.MANAGE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('USERS.MANAGE.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('USERS.MANAGE.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            //POST: {
            //    fields: [
            //        {
            //            type: 'text',
            //            model: 'descripcion',
            //            label: 'Descripción',
            //            required: true,
            //            hint: 'Descripción del insumo',
            //            validations: {
            //                regex: '.{1,200}',
            //                errors: {
            //                    regex: 'La descripción debe contener máximo 200 caracteres',
            //                    required: 'La descripción es requerida'
            //                }
            //            }
            //        },
            //        {
            //            type: 'text',
            //            model: 'costo',
            //            label: 'Costo',
            //            required: true,
            //            hint: 'Costo actual del insumo (máximo 2 decimales)',
            //            validations: {
            //                //regex: '(\d+)(\.(\d{1,2}))*',
            //                errors: {
            //                    regex: 'Formato de costo inválido',
            //                    required: 'El costo es requerido'
            //                }
            //            }
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'marca_insumo',
            //            label: 'Marca del insumo',
            //            hint: 'Seleccione para listar los modelos',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_brand,
            //                name: 'Marca del insumo',
            //                model: 'id',
            //                option: 'descripcion',
            //                loadMoreButtonText: 'Cargar mas...',
            //                elements: 'results',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'modelo_insumo_id',
            //            label: 'Modelo del insumo',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_model,
            //                query: 'marca__id',
            //                requires: 'marca_insumo',
            //                name: 'Modelo del insumo',
            //                model: 'id',
            //                option: 'descripcion',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'proveedor_id',
            //            label: 'Proveedor del insumo',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.supplier,
            //                name: 'Proveedor del insumo',
            //                model: 'id',
            //                option: 'razon_social',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'unidad_id',
            //            label: 'Unidad del insumo',
            //            hint: 'Unidad en la que el insumo es medido',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_unit,
            //                name: 'Unidad del insumo',
            //                model: 'id',
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'categoria_insumo_id',
            //            label: 'Categoría del insumo',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_category,
            //                name: 'Categoría del insumo',
            //                model: 'id',
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'tipo_componente_id',
            //            label: 'Tipo de componente',
            //            hint: 'Unidad en la que el insumo es medido',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.component_type,
            //                name: 'Tipo de componente',
            //                model: 'com_code',
            //                showModel: true,
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        }
            //    ],
            //    dialog: {
            //        title: Translate.translate('USERS.MANAGE.LABELS.CREATE'),
            //        okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
            //        cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
            //        loading: Translate.translate('USERS.MANAGE.LABELS.CREATING')
            //    }
            //},
            //PUT: {
            //    id: 'id',
            //    fields: [
            //        {
            //            type: 'text',
            //            model: 'descripcion',
            //            label: 'Descripción',
            //            required: true,
            //            hint: 'Descripción del insumo',
            //            validations: {
            //                regex: '.{1,200}',
            //                errors: {
            //                    regex: 'La descripción debe contener máximo 200 caracteres',
            //                    required: 'La descripción es requerida'
            //                }
            //            }
            //        },
            //        {
            //            type: 'text',
            //            model: 'costo',
            //            label: 'Costo',
            //            required: true,
            //            hint: 'Costo actual del insumo (máximo 2 decimales)',
            //            validations: {
            //                //regex: '\d+(\.(\d{1,2}))*',
            //                errors: {
            //                    regex: 'Formato de costo inválido',
            //                    required: 'El costo es requerido'
            //                }
            //            }
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'marca_insumo',
            //            label: 'Marca del insumo',
            //            hint: 'Seleccione para listar los modelos',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_brand,
            //                name: 'Marca del insumo',
            //                model: 'id',
            //                option: 'descripcion',
            //                loadMoreButtonText: 'Cargar mas...',
            //                elements: 'results',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'modelo_insumo_id',
            //            label: 'Modelo del insumo',
            //            bindTo: 'modelo_insumo',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_model,
            //                query: '?marca__id=',
            //                requires: 'marca_insumo',
            //                name: 'Modelo del insumo',
            //                model: 'id',
            //                option: 'descripcion',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'proveedor_id',
            //            label: 'Proveedor del insumo',
            //            bindTo: 'proveedor',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.supplier,
            //                name: 'Proveedor del insumo',
            //                model: 'id',
            //                option: 'razon_social',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'unidad_id',
            //            label: 'Unidad del insumo',
            //            bindTo: 'unidad',
            //            hint: 'Unidad en la que el insumo es medido',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_unit,
            //                name: 'Unidad del insumo',
            //                model: 'id',
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'categoria_insumo_id',
            //            label: 'Categoría del insumo',
            //            bindTo: 'categoria_insumo',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.consumable_category,
            //                name: 'Categoría del insumo',
            //                model: 'id',
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        },
            //        {
            //            type: 'catalog',
            //            model: 'tipo_componente_id',
            //            label: 'Tipo de componente',
            //            hint: 'Unidad en la que el insumo es medido',
            //            bindTo: 'tipo_componente',
            //            catalog: {
            //                url: EnvironmentConfig.site.rest.api
            //                    + '/' + URLS.inventory.base
            //                    + '/' + URLS.inventory.catalogues.base
            //                    + '/' + URLS.inventory.catalogues.component_type,
            //                name: 'Tipo de componente',
            //                model: 'com_code',
            //                showModel: true,
            //                option: 'nombre',
            //                elements: 'results',
            //                loadMoreButtonText: 'Cargar mas...',
            //                pagination: {
            //                    total: PAGINATION.total,
            //                    limit: PAGINATION.limit,
            //                    offset: PAGINATION.offset,
            //                    pageSize: PAGINATION.pageSize
            //                },
            //                softDelete: {
            //                    hide: 'deleted',
            //                    reverse: false
            //                }
            //            },
            //            required: true
            //        }
            //    ],
            //    dialog: {
            //        title: Translate.translate('USERS.MANAGE.LABELS.MODIFY'),
            //        okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
            //        cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
            //        loading: Translate.translate('USERS.MANAGE.LABELS.MODIFYING')
            //    }
            //},
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('USERS.MANAGE.LABELS.DELETE'),
                    message: Translate.translate('USERS.MANAGE.LABELS.DELETE_CONFIRM'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('USERS.MANAGE.LABELS.DELETING')
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
                        type: 'file',
                        file: {
                            mode: 'preview'
                        },
                        model: 'foto',
                        label: 'Foto'
                    },
                    {
                        type: 'object_property',
                        model: 'user__username',
                        label: 'Nombre de usuario'
                    },
                    {
                        type: 'object_property',
                        model: 'user__email',
                        label: 'E-Mail',
                        nullOrEmpty: 'Sin E-Mail registrado'
                    },
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'apellido_paterno',
                        label: 'Apellido Paterno',
                        nullOrEmpty:'Sin apellido paterno'
                    },
                    {
                        type: 'text',
                        model: 'apellido_materno',
                        label: 'Apellido Materno',
                        nullOrEmpty:'Sin apellido materno'
                    },
                    {
                        type: 'object_property',
                        model: 'sucursal__nombre',
                        label: 'Sucursal',
                        nullOrEmpty: 'Sin sucursal'
                    },
                    {
                        type: 'object_property',
                        model: 'udn__agencia',
                        label: 'UDN-Agencia',
                        nullOrEmpty: 'Sin UDN-Agencia'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: Translate.translate('USERS.MANAGE.LABELS.SEARCH'),
                    searchButton: Translate.translate('MAIN.BUTTONS.SEARCH'),
                    loadingText: Translate.translate('USERS.MANAGE.LABELS.SEARCHING')
                },
                filters: [
                    {
                        type: 'icontains',
                        model: 'descripcion',
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
