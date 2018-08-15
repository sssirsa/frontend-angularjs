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
        vm.filesSelected = filesSelected;

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

        function filesSelected(files, field) {
            //fileProcessing MUST be a function in case it exists
            let fileProcessing = field.fileUploader['filesSelected'];
            if (fileProcessing) {
                files = fileProcessing(files);
            }
            vm.objectToCreate[field.model] = files;
            console.debug(vm.objectToCreate);
        }
    }

})();
