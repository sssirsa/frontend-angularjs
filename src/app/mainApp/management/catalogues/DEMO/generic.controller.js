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
                        model: '',
                        required: true,
                        label: 'field_name',
                        validations: [
                            {
                                regex: '',
                                max: 0,
                                min: 100,
                                date_format: 'DD/MM/YYYY',
                                error_message: 'Required field'
                            }
                        ]
                    }

                ]
            },
            PUT: {
                fields:[]
            },
            DELETE: {
                id:'id_field'
            },
            LIST: {
                fields:[]
            },
            GET: {
                fields:[]
            }
        }

    }

})();
