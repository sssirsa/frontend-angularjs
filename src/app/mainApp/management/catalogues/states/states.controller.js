(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('statesController', statesController)

    function statesController(URLS, Translate)
    {

        var vm = this;

        vm.url = URLS.estado;
        vm.kind = 'Mobile';
        vm.name = Translate.translate('STATES.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estado';
        vm.createButtonText = 'Crear Estado';
        vm.deleteButtonText = 'Borrar Estado';
        vm.modifyButtonText = 'Editar Estado';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Estados';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Estado';

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
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Codigo Estado',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Estado',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estado'
                }
            },
            PUT: {
                fields: [],
                dialog: {
                    title: 'Editar Estado',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estado'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Estado',
                    message: 'Confirme la eliminación de Estado',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estado'
                }
            },
            LIST: {
                // elements: 'results',
                mode: 'infinite',
                // pagination: {
                //     total: 'count'
                // },
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Codigo Estado'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Estado',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Estado'
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
                    },
                    {
                        type: 'istartswith',
                        model: 'codigo_estado',
                        header: 'por Codigo estado',
                        label: 'Codigo estado',
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
