(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('nextStepController',nextStepController);

    function nextStepController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        var technicalUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.next_step);

        vm.url = technicalUrl;
        vm.kind = 'technical_services';
        vm.name = Translate.translate('NEXT_STEP.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('NEXT_STEP.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('NEXT_STEP.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('NEXT_STEP.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('NEXT_STEP.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('NEXT_STEP.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('NEXT_STEP.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
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
                    title: Translate.translate('NEXT_STEP.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Siguiente Paso'
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
                    title: Translate.translate('NEXT_STEP.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Siguiente Paso'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('NEXT_STEP.LABELS.DELETE'),
                    message: 'Confirme la eliminación del Siguiente Paso',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Siguiente Paso'
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
                    title: 'Búsqueda de Siguiente Paso',
                    searchButton: Translate.translate('NEXT_STEP.LABELS.SEARCH'),
                    loadingText: 'Buscando Siguiente Paso'
                },
                filters: [
                    {
                        type: 'istartswith',
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
