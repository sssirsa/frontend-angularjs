(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('statusNotLabeledController',statusNotLabeledController);

    function statusNotLabeledController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    )
    {

        var vm = this;

        var managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.status_not_labeled);


        vm.url = managementUrl;
        vm.kind = 'management';
        vm.name = Translate.translate('STATUS_NOT_LABELED.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STATUS_NOT_LABELED.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('STATUS_NOT_LABELED.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('STATUS_NOT_LABELED.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('STATUS_NOT_LABELED.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('STATUS_NOT_LABELED.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('STATUS_NOT_LABELED.LABELS.LOADING_MESSAGE');

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
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false
                    },
                    {
                        type: 'text',
                        model: 'accion',
                        label: 'Acción',
                        required: false
                    }
                ],
                dialog: {
                    title: Translate.translate('STATUS_NOT_LABELED.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estatus'
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
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false
                    },
                    {
                        type: 'text',
                        model: 'accion',
                        label: 'Acción',
                        required: false
                    }
                ],
                dialog: {
                    title: Translate.translate('STATUS_NOT_LABELED.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estatus'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('STATUS_NOT_LABELED.LABELS.DELETE'),
                    message: 'Confirme la eliminación del Estatus no capitalizado',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estatus'
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
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'accion',
                        label: 'Acción'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Estatus',
                    searchButton: Translate.translate('STATUS_NOT_LABELED.LABELS.SEARCH'),
                    loadingText: 'Buscando Estatus'
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
                    }
                ]
            }
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }

})();
