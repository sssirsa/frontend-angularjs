(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('SymptomController',SymptomController);

    function SymptomController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    )
    {

        var vm = this;

        var technicalUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.symptom);

        vm.url = technicalUrl;
        vm.kind = 'technical_services';
        vm.name = Translate.translate('SYMPTOM.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('SYMPTOM.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('SYMPTOM.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('SYMPTOM.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('SYMPTOM.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('SYMPTOM.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('SYMPTOM.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'code',
                        label: 'Código',
                        required: true,
                        validations: {
                            regex: "[0-9]{10,15}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
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
                    title: Translate.translate('SYMPTOM.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Sintoma'
                }
            },
            PUT: {
                id:'code',
                fields: [
                    {
                        type: 'text',
                        model: 'code',
                        label: 'Código',
                        required: true,
                        validations: {
                            regex: "[0-9]{10,15}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
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
                    title: Translate.translate('SYMPTOM.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Sintoma'
                }
            },
            DELETE: {
                id: 'code',
                dialog: {
                    title: Translate.translate('SYMPTOM.LABELS.DELETE'),
                    message: 'Confirme la eliminación del Sintoma',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Sintoma'
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
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Sintoma',
                    searchButton: Translate.translate('SYMPTOM.LABELS.SEARCH'),
                    loadingText: 'Buscando Sintoma'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'code',
                        header: 'por Código',
                        label: 'Código',
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
