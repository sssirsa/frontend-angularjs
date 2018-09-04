(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('segmentationController', segmentationController)

    /* @ngInject */
    function segmentationController(URLS, Translate) {

        var vm = this;

        vm.url = URLS.segmentation;
        vm.kind = 'Mobile';
        vm.name = Translate.translate('SEGMENTATION.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Segmentación';
        vm.createButtonText = 'Crear Segmentación';
        vm.deleteButtonText = 'Borrar Segmentación';
        vm.modifyButtonText = 'Editar Segmentación';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas segmentaciones';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Segmentaciones';

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
                        validations: {
                            errors: {
                                required: 'El nombre del estado es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripcion',
                        required: false
                    },
                    {
                        type: 'color',
                        model: 'color',
                        label: 'Color',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El color es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear segmentación',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Segmentación'
                }
            },
            PUT: {
                fields: [],
                dialog: {
                    title: 'Editar segmentación',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Segmentación'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar segmentación',
                    message: 'Confirme la eliminación de la segmentación',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Segmentación'
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
                        label: 'Descripcion'
                    },
                    {
                        type: 'color',
                        model: 'color',
                        label: 'Color'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Segmentación',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando segmentación'
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
        }

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }

    }

})();
