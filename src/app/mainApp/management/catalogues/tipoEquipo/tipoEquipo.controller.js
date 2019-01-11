(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('TipoEquipoController', TipoEquipoController)

    function TipoEquipoController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        const managementUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.equipment_type);

        vm.url = managementUrl;
        vm.kind = 'Management';
        vm.name = Translate.translate('EQUIPMENT_TYPE.FORM.LABEL.MODEL');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Tipo equipo';
        vm.createButtonText = 'Crear Tipo equipo';
        vm.deleteButtonText = 'Borrar Tipo equipo';
        vm.modifyButtonText = 'Editar Tipo equipo';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas tipos equipo';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Tipos equipo';

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
                        required: true,
                        validations: {
                            errors: {
                                required: 'El nombre del estado es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Tipo equipo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Tipo equipo'
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
                                required: 'El nombre del estado es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Descripcion',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El nombre del estado es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Tipo equipo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Tipo equipo'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Tipo equipo',
                    message: 'Confirme la eliminación del Tipo equipo',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Tipo equipo'
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
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Tipo equipo',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Tipo equipo'
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
