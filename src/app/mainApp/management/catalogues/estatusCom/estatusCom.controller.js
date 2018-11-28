(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('estatusComController',estatusComController);

    function estatusComController(URLS, Translate, MANAGEMENT, EnvironmentConfig)
    {

        var vm = this;

        vm.url = EnvironmentConfig.site.rest.api + MANAGEMENT.baseManagement + MANAGEMENT.project.catalogue + URLS.estatus_com;
        vm.kind = 'Management';
        vm.name = Translate.translate('STATUS_COM.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estatus COM';
        //vm.createButtonText = 'Crear Categoría';
        //vm.deleteButtonText = 'Borrar Categoría';
        //vm.modifyButtonText = 'Editar Categoría';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Estatus COM';
        vm.removeFilterButtonText = 'Qutar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Estatus COM';

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
                    title: 'Crear Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Estatus COM'
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
                    title: 'Editar Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Estatus COM'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Estatus COM',
                    message: 'Confirme la eliminación de Estatus COM',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Estatus COM'
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
                    title: 'Busqueda de Estatus COM',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Estatus COM'
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
