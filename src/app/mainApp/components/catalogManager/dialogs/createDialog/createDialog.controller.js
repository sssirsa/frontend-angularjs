(function () {
    angular
        .module('app.mainApp')
        .controller('CatalogCreateDialogController', CatalogCreateDialogController);
    function CatalogCreateDialogController($mdDialog, dialog, provider, fields) {
        var vm = this;

        vm.dialog = dialog;
        vm.fields = fields;
        vm.CatalogProvider = provider;

        vm.objectToCreate = {};

        vm.create = create;
        vm.cancel = cancel;

        function create(objectToCreate) {
            vm.createLoader = vm.CatalogProvider
                .create(objectToCreate)
                .then(function (createdElement) {
                    $mdDialog.hide(createdElement);
                })
                .catch(function (createError) {
                    $mdDialog.cancel(createError);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

})();
