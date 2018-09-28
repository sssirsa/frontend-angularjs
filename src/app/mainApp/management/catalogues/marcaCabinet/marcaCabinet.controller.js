(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('MarcaCabinetController',MarcaCabinetController);

    function MarcaCabinetController(URLS, Translate) {
        var vm = this;

        vm.url = URLS.marca;
        vm.kind = 'Web';
        vm.name = Translate.translate('Cabinet_Brand.title');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Marca';
        vm.createButtonText = 'Crear Marca';
        vm.deleteButtonText = 'Borrar Marca';
        vm.modifyButtonText = 'Editar Marca';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Marca';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Marcas';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
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
                        model: 'categoria',
                        label: 'Categoria',
                        hint: 'Cabinet, carrito, etc.',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Marca',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Marca'
                }
            },
            PUT: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'categoria',
                        label: 'Categoria',
                        hint:'Cabinet, carrito, etc.',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Marca',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Marca'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Marca',
                    message: 'Confirme la eliminación de Marca',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Marca'
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
                        label: 'Descripcion'
                    },
                    {
                        type: 'text',
                        model: 'categoria',
                        label: 'Categoria'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Marca',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Marca'
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
                    },
                    {
                        type: 'istartswith',
                        model: 'categoria',
                        header: 'por Categoria',
                        label: 'Categoria',
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
