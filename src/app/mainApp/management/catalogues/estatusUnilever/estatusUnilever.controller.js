(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('estatusUnileverController',estatusUnileverController);

    function estatusUnileverController(URLS, Translate, MANAGEMENT, EnvironmentConfig)
    {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_unilever;
        vm.kind = 'Management';
        vm.name = Translate.translate('STATUS_UNILEVER.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estatus Unilever';
        //vm.createButtonText = 'Crear Categoría';
        //vm.deleteButtonText = 'Borrar Categoría';
        //vm.modifyButtonText = 'Editar Categoría';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Estatus Unilever';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Estatus Unilever';

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
                    }
                ],
                dialog: {
                    title: 'Crear Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estatus Unilever'
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
                    }
                ],
                dialog: {
                    title: 'Editar Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estatus Unilever'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Estatus Unilever',
                    message: 'Confirme la eliminación de Estatus Unilever',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estatus Unilever'
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
                    title: 'Busqueda de Estatus Unilever',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Estatus Unilever'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'Estatus',
                        header: 'por Estatus',
                        label: 'Estatus',
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
