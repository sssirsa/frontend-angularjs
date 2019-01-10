(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('CondicionController',CondicionController);

    function CondicionController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogue.base + '/' + URLS.management.catalogue.condition);

        vm.url = managementUrl;
        vm.kind = 'Management';
        vm.name = Translate.translate('CONDITION.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('CONDITION.LABELS.SEARCH');
        //vm.createButtonText = Translate.translate('CONDITION.LABELS.CREATE');
        //vm.deleteButtonText = Translate.translate('CONDITION.LABELS.DELETE');
        //vm.modifyButtonText = Translate.translate('CONDITION.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('CONDITION.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('CONDITION.LABELS.LOADING_MESSAGE');

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
                    },
                    {
                        type: 'text',
                        model: 'letra',
                        label: 'Letra',
                        required: true,
                        validations:{
                            regex: "[a-z]",
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Condición',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Condición'
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
                    },
                    {
                        type: 'text',
                        model: 'letra',
                        label: 'Letra',
                        required: true,
                        validations:{
                            regex: "[a-z]",
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Condición',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Condición'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Condición',
                    message: 'Confirme la eliminación de Condición',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Condición'
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
                        model: 'letra',
                        label: 'Letra'
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
                    title: 'Búsqueda de Condición',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Condición'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'letra',
                        header: 'por Letra',
                        label: 'Letra',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }*/
        };

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
