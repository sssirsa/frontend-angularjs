(function () {
    angular
        .module('app.mainApp')
        .controller('GenericCatalogueController', GenericCatalogController);

    function GenericCatalogController() {
        var vm = this;

        vm.url = 'estado';
        vm.kind = 'Mobile';
        vm.name = 'Catálogo';
        vm.namePlural = 'Catálogos';
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
                id: 'id_field'
            },
            LIST: {
                elements: 'results',
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
                ]
            },
            GET: {
                fields: []
            },
            SEARCH: {

            }
        }

    }

})();
