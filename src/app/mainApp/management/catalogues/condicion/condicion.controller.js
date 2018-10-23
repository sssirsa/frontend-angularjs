(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('CondicionController',CondicionController);

    function CondicionController(URLS, Translate)
    {

        var vm = this;

        vm.url = 'http://api-gateway.sssirsa.com/management-dev/catalogue/'+ URLS.condicion;
        vm.kind = 'Management';
        vm.name = Translate.translate('CONDITION.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Condición';
        //vm.createButtonText = 'Crear Categoría';
        //vm.deleteButtonText = 'Borrar Categoría';
        //vm.modifyButtonText = 'Editar Categoría';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas condiciones';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Condiciones';

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
                        model: 'Letra',
                        label: 'letra'
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
                    title: 'Busqueda de Condición',
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
