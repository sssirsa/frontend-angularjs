(function () {
    angular
        .module('app.mainApp')
        .controller('GenericCatalogueController', GenericCatalogController);

    function GenericCatalogController() {
        var vm = this;

        vm.url = 'estado';
        vm.kind = 'Mobile';

        //Labels
        vm.name = 'Estado';
        vm.namePlural = 'Estados';
        vm.totalText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estados';
        vm.createButtonText = 'Crear Estado';
        vm.deleteButtonText = 'Borrar Estado';
        vm.modifyButtonText = 'Editar Estado';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas estados';

        //Messages
        vm.loadingMessage = 'Cargando Estados';

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
                                required:'El nombre del estado es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Código Estado',
                        required: true,
                        validations: {
                            regex: "[A-Z]{3,3}",
                            errors: {
                                regex: 'El código de estado deben ser 3 letras en MAYÚSCULAS',
                                required: 'El código de estado es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear estado',
                    okButton: 'Guardar',
                    cancelButton: 'Cancelar',
                    loading: 'Creando estado'
                }
            },
            PUT: {
                fields: [],
                dialog: {
                    title: 'Editar estado',
                    okButton: 'Guardar',
                    cancelButton: 'Cancelar',
                    loading: 'Guardando estado'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar estado',
                    message: 'Confirme la eliminación del estado',
                    okButton: 'Aceptar',
                    cancelButton: 'Cancelar',
                    loading: 'Eliminando estado'
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
                        model: 'codigo_estado',
                        label: 'Código Estado'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            GET: {
                fields: []
            },
            SEARCH: {

            }
        }

    }

})();
