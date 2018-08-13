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
        vm.deletingMessage = 'Eliminando Estado';
        vm.savingMessage = 'Guardando Estado';
        vm.creatingMessage = 'Creando Estado';
        
        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
                        required: true
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Código Estado',
                        required: true,
                        validations: [
                            {
                                regex: "/^[a-zA-Z]{3,3}/",
                                error_message: 'El código de estado deben ser 3 letras en MAYÚSCULAS'
                            }
                        ]
                    }
                ]
            },
            PUT: {
                fields: []
            },
            DELETE: {
                id: 'id'
            },
            LIST: {
                elements: 'results',
                mode:'infinite',
                pagination: {
                    total:'count'
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
