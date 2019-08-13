(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('estatusUnileverController',estatusUnileverController);

    function estatusUnileverController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    ) {
        var vm = this;

        var managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.status_unilever);

        vm.url = managementUrl;
        vm.kind = 'Management';
        vm.name = Translate.translate('STATUS_UNILEVER.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STATUS_UNILEVER.LABELS.SEARCH');
        //vm.createButtonText = Translate.translate('STATUS_UNILEVER.LABELS.CREATE');
        //vm.deleteButtonText = Translate.translate('STATUS_UNILEVER.LABELS.DELETE');
        //vm.modifyButtonText = Translate.translate('STATUS_UNILEVER.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('STATUS_UNILEVER.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('STATUS_UNILEVER.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            /*POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estatus Unilever'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estatus Unilever'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Estatus Unilever',
                    message: 'Confirme la eliminación de Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estatus Unilever'
                }
            },*/
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
                        model: 'code',
                        label: 'Código'
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
            }/*,
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Estatus Unilever',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Estatus Unilever'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'Estatus',
                        header: 'por Estatus',
                        label: 'Estatus',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }*/
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }

})();
