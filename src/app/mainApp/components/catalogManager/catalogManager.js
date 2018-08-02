(function () {
    angular
        .module('app.mainApp')
        .component('catalogManager', {
            templateUrl: 'app/mainApp/components/catalogManager/catalogManager.tmpl.html',
            controller: CatalogManagerController,
            bindings: {
                name: '<', //Name to show, default is 'Catalog'
                url: '<', //Full or partial URL, depending on kind
                kind: '<', //Mobile, Web, Generic. Default is 'Generic'
                actions: '<'
                /*
                 "actions": {
                    "POST": {
                        "id": {
                            "type": "integer",
                            "required": false,
                            "read_only": true,
                            "label": "ID"
                        },
                        "deleted": {
                            "type": "boolean",
                            "required": false,
                            "read_only": false,
                            "label": "Deleted"
                        },
                        "nombre": {
                            "type": "string",
                            "required": true,
                            "read_only": false,
                            "label": "Nombre",
                            "max_length": 100
                        },
                        "codigo_estado": {
                            "type": "string",
                            "required": true,
                            "read_only": false,
                            "label": "Codigo estado",
                            "max_length": 100
                        }
                    }
                }
                 */
            }
        });

    /* @ngInject */
    function CatalogManagerController() {
        var vm = this;

        //Initializing or assingning default values to global variables
        vm.name ? vm.Name = vm.name : vm.Name = 'Catalog';
        vm.url ? vm.Url = vm.url : null;
        vm.kind ? vm.Kind = vm.kind : vm.Kind = 'Generic';
        vm.actions ? vm.Actions : vm.actions = null;

    }

})();
