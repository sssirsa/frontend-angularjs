(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('EtapasController', EtapasController)

    /* @ngInject */
    function EtapasController(URLS, Translate)
    {

        var vm = this;

        vm.url = URLS.etapa;
        vm.kind = 'Web';
        vm.name = Translate.translate('STAGES.FORM.LABEL.MODEL');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Etapa';
        vm.createButtonText = 'Crear Etapa';
        vm.deleteButtonText = 'Borrar Etapa';
        vm.modifyButtonText = 'Editar Etapa';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Etapas';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Etapas';

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
                        model: 'descripcion',
                        label: 'Descripción',
                        required: false
                    },
                    {
                        type: 'text',
                        model: 'taller',
                        label: 'Taller',
                        required: false
                    }
                ],
                dialog: {
                    title: 'Crear Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Etapa'
                }
            },
            PUT: {
                fields: [],
                dialog: {
                    title: 'Editar Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Etapa'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Etapa',
                    message: 'Confirme la eliminación de Etapa',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Etapa'
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
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripción'
                    },
                    {
                        type: 'text',
                        model: 'taller',
                        label: 'Taller'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Etapa',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Etapa'
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
                        model: 'taller',
                        header: 'por Taller',
                        label: 'Taller',
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
