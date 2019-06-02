(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('componentTypeController',componentTypeController);

    function componentTypeController(
        URLS,
        Translate,
        OPTIONS,
        EnvironmentConfig,
        PAGINATION
    )
    {

        var vm = this;

        var inventoryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogues.base + '/' + URLS.inventory.catalogues.component_type);

        vm.url = inventoryUrl;
        vm.kind = 'inventory';
        vm.name = Translate.translate('COMPONENT_TYPE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = Translate.translate('COMPONENT_TYPE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('COMPONENT_TYPE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('COMPONENT_TYPE.LABELS.DELETE');
        vm.modifyButtonText = Translate.translate('COMPONENT_TYPE.LABELS.MODIFY');
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = Translate.translate('COMPONENT_TYPE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = Translate.translate('COMPONENT_TYPE.LABELS.LOADING_MESSAGE');

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
                    },
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        required: true,
                        hint:'El campo es númerico de 10 a 15 caracteres',
                        validations: {
                            regex: "[0-9]{10,15}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico de 10 a 15 caracteres',
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('COMPONENT_TYPE.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando tipo componente'
                }
            },
            PUT: {
                id:'com_code',
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
                    },
                    {
                        type: 'text',
                        model: 'com_code',
                        label: 'Código COM',
                        hint:'El campo es númerico de 10 a 15 caracteres',
                        required: true,
                        validations: {
                            regex: "[0-9]{10,15}",
                            errors: {
                                regex: 'Formato incorrecto, el campo es númerico de 10 a 15 caracteres',
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('COMPONENT_TYPE.LABELS.MODIFY'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando tipo componente'
                }
            },
            DELETE: {
                id: 'com_code',
                dialog: {
                    title: Translate.translate('COMPONENT_TYPE.LABELS.DELETE'),
                    message: 'Confirme la eliminación del tipo de componente',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando tipo componente'
                }
            },
            LIST: {
                elements: 'results',
                mode: PAGINATION.mode,
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
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
                        model: 'com_code',
                        label: 'Código COM'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Tipo de Componente',
                    searchButton: Translate.translate('COMPONENT_TYPE.LABELS.SEARCH'),
                    loadingText: 'Buscando Tipo de Componente'
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
                        model: 'descripcion',
                        header: 'por Descripción',
                        label: 'Descripción',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'istartswith',
                        model: 'com_code',
                        header: 'por Código COM',
                        label: 'Código COM',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }

})();
