(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('estatusComController',estatusComController);

    function estatusComController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        var managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.status_com);

        vm.url = managementUrl;
        vm.kind = 'Management';
        vm.name = Translate.translate('STATUS_COM.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('STATUS_COM.LABELS.SEARCH');
        //vm.createButtonText = Translate.translate('STATUS_COM.LABELS.CREATE');
        //vm.deleteButtonText = Translate.translate('STATUS_COM.LABELS.DELETE');
        //vm.modifyButtonText = Translate.translate('STATUS_COM.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('STATUS_COM.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('STATUS_COM.LABELS.LOADING_MESSAGE');

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
                    title: 'Crear Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estatus COM'
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
                    title: 'Editar Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estatus COM'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Estatus COM',
                    message: 'Confirme la eliminación de Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estatus COM'
                }
            },*/
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {
                    total: 'count'
                },
                fields: [
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
                    title: 'Búsqueda de Estatus COM',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Estatus COM'
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
