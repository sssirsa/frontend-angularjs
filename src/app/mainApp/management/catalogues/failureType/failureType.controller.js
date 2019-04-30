(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('failureTypeController',failureTypeController);

    function failureTypeController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        var technicalUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.failure_type);

        vm.url = technicalUrl;
        vm.kind = 'technical_services';
        vm.name = Translate.translate('FAILURE_TYPE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('FAILURE_TYPE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('FAILURE_TYPE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('FAILURE_TYPE.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('FAILURE_TYPE.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('FAILURE_TYPE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('FAILURE_TYPE.LABELS.LOADING_MESSAGE');

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
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('FAILURE_TYPE.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Clasificación de Falla'
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
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('FAILURE_TYPE.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Calsificación de Falla'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('FAILURE_TYPE.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Clasificación de Falla',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Clasificación de Falla'
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
                        model: 'nombre',
                        label: 'Nombre'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Clasificación de Falla',
                    searchButton: Translate.translate('FAILURE_TYPE.LABELS.SEARCH'),
                    loadingText: 'Buscando Clasificación de Falla'
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
