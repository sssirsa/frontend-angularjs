(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('CategoriaController',CategoriaController);

    function CategoriaController(URLS, Translate, EnvironmentConfig, MANAGEMENT)
    {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.categoria;

        vm.kind = 'Management';
        vm.name = Translate.translate('Category.title');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Categoría';
        vm.createButtonText = 'Crear Categoría';
        vm.deleteButtonText = 'Borrar Categoría';
        vm.modifyButtonText = 'Editar Categoría';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Categorías';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Categorías';

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
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Categoría',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Categoría'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
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
                        model: 'descripcion',
                        label: 'Descripción',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Categoría',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Categoría'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Categoría',
                    message: 'Confirme la eliminación de Categoría',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Categoría'
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
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Busqueda de Categoría',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Categoría'
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
        };

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
            console.log(element);
        }
    }

})();
