(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('impedimentReasonController',impedimentReasonController);

    function impedimentReasonController(URLS, Translate, EnvironmentConfig)
    {

        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.impediment);

        vm.url = managementUrl;
        vm.kind = 'management';
        vm.name = Translate.translate('IMPEDIMENT_REASON.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('IMPEDIMENT_REASON.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('IMPEDIMENT_REASON.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('IMPEDIMENT_REASON.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('IMPEDIMENT_REASON.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('IMPEDIMENT_REASON.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('IMPEDIMENT_REASON.LABELS.LOADING_MESSAGE');

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
                        required: false,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('IMPEDIMENT_REASON.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Motivo de Impedimento'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('IMPEDIMENT_REASON.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Motivo de Impedimento'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('IMPEDIMENT_REASON.LABELS.DELETE'),
                    message: 'Confirme la eliminación del motivo de impedimento',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Motivo de impedimento'
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
                    title: 'Búsqueda de Motivo de Impedimento de Salida',
                    searchButton: Translate.translate('IMPEDIMENT_REASON.LABELS.SEARCH'),
                    loadingText: 'Buscando Motivo de Impedimento'
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

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
