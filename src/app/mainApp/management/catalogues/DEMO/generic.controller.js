(function () {
    angular
        .module('app.mainApp')
        .controller('GenericCatalogueController', GenericCatalogController);

    function GenericCatalogController() {
        var vm = this;

        vm.url = '';
        vm.kind = 'Generic';
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

            },
            DELETE: {

            },
            LIST: {

            },
            GET: {

            }
        }

    }

})();
