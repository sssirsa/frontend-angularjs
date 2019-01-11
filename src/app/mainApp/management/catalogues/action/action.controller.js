(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('actionController',actionController);

    function actionController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        const technicalUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogue.base + '/' + URLS.technical_service.catalogue.action);

        vm.url = technicalUrl;
        vm.kind = 'technical_services';
        vm.name = Translate.translate('ACTION.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('ACTION.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('ACTION.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('ACTION.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('ACTION.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('ACTION.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('ACTION.LABELS.LOADING_MESSAGE');

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
                    title: Translate.translate('ACTION.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Acción'
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
                    title: Translate.translate('ACTION.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Acción'
                }
            },
            DELETE: {
                id: 'com_code',
                dialog: {
                    title: Translate.translate('ACTION.LABELS.DELETE'),
                    message: 'Confirme la eliminación de la Acción',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Acción'
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
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Acción',
                    searchButton: Translate.translate('ACTION.LABELS.SEARCH'),
                    loadingText: 'Buscando Acción'
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
