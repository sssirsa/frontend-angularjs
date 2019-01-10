(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('comIncidenceController',comIncidenceController);

    function comIncidenceController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        const technicalUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogue.base + '/' + URLS.technical_service.catalogue.com_incidence);

        const nextStepUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogue.base + '/' + URLS.technical_service.catalogue.next_step);


        vm.url = technicalUrl;
        vm.kind = 'technical_services';
        vm.name = Translate.translate('COM_INCIDENCE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('COM_INCIDENCE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('COM_INCIDENCE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('COM_INCIDENCE.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('COM_INCIDENCE.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('COM_INCIDENCE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('COM_INCIDENCE.LABELS.LOADING_MESSAGE');

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        required: true,
                        validations:{
                            errors:{
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
                    },
                    {
                        type: 'catalog',
                        model: 'siguiente_paso_id',
                        label: 'Siguiente Paso',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: nextStepUrl,
                            kind: 'technical_services',
                            model: 'id',
                            option: 'descripcion',
                            name: 'Siguiente Paso',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('COM_INCIDENCE.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Incidencia COM'
                }
            },
            PUT: {
                id:'com_code',
                fields: [
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        required: true,
                        validations:{
                            errors:{
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
                    },
                    {
                        type: 'catalog',
                        model: 'siguiente_paso_id',
                        label: 'Siguiente Paso',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: nextStepUrl,
                            kind: 'technical_services',
                            model: 'id',
                            option: 'descripcion',
                            name: 'Siguiente Paso',
                            elements: 'results',
                            pagination: {
                                total: 'count'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('COM_INCIDENCE.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Incidencia COM'
                }
            },
            DELETE: {
                id: 'com_code',
                dialog: {
                    title: Translate.translate('COM_INCIDENCE.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Incidencia COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Incidencia COM'
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
                        model: 'com_code',
                        label: 'Código COM'
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'siguiente_paso_descripcion',
                        label: 'Siguiente Paso'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Incidencia COM',
                    searchButton: Translate.translate('COM_INCIDENCE.LABELS.SEARCH'),
                    loadingText: 'Buscando Incidencia COM'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'com_code',
                        header: 'por Código COM',
                        label: 'Código',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        };

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
