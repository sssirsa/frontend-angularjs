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
            + '/' + URLS.management.administration.person;

        vm.queries = [];
        vm.queries.push(QUERIES.user.by_existing_email);

        vm.name = Translate.translate('USERS.MANAGE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';
        vm.noResultsText = Translate.translate('USERS.MANAGE.LABELS.NO_RESULTS');

        //Button labels
        vm.searchButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.SEARCH');
        vm.createButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.CREATE');
        vm.deleteButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.DELETE');
        vm.modifyButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.MODIFY');
        vm.nextButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.NEXT');
        vm.previousButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('USERS.MANAGE.LABELS.BUTTONS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('USERS.MANAGE.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('USERS.MANAGE.DIALOG.DELETE.TITLE'),
                    message: Translate.translate('USERS.MANAGE.DIALOG.DELETE.MESSAGE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('USERS.MANAGE.DIALOG.DELETE.LOADING')
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
                        nullOrEmpty: 'Sin apellido paterno'
                    },
                    {
                        type: 'text',
                        model: 'apellido_materno',
                        label: 'Apellido Materno',
                        nullOrEmpty: 'Sin apellido materno'
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
                    title: Translate.translate('USERS.MANAGE.DIALOG.SEARCH.TITLE'),
                    searchButton: Translate.translate('MAIN.BUTTONS.SEARCH'),
                    loadingText: Translate.translate('USERS.MANAGE.DIALOG.SEARCH.LOADING')
                },
                filters: [
                    {
                        type: 'icontains',
                        model: QUERIES.user.by_username,
                        header: 'por Usuario',
                        label: 'Nombre de usuario',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'icontains',
                        model: QUERIES.user.by_name,
                        header: 'por Nombre',
                        label: 'Nombre de la persona',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'icontains',
                        model: QUERIES.user.by_middlename,
                        header: 'por Apellido paterno',
                        label: 'Apellido paterno de la persona',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'icontains',
                        model: QUERIES.user.by_lastname,
                        header: 'por Apellido materno',
                        label: 'Apellido materno de la persona',
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
