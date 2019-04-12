(function () {
    'use_strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('proyectosController', proyectosController);

    function proyectosController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        const entriesUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.project);

        vm.url = entriesUrl;
        vm.kind = 'entries_departures';
        vm.name = Translate.translate('Projects.Header');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Proyecto';
        vm.createButtonText = 'Crear Proyecto';
        vm.deleteButtonText = 'Borrar Proyecto';
        vm.modifyButtonText = 'Editar Proyecto';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Proyecto';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Proyecto';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre del proyecto',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Proyecto',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Proyecto'
                }
            },
            PUT: {
                id: 'id',
                fields: [
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre del proyecto',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Proyecto',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Proyecto'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Proyecto',
                    message: 'Confirme la eliminación del Proyecto',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Proyecto'
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
                        label: 'Nombre'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Proyecto',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Proyecto'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'descripcion',
                        header: 'por Nombre',
                        label: 'Nombre del proyecto',
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
