(function () {
    angular
        .module('app.mainApp')
        .controller('CatalogDeleteDialogController', CatalogDeleteDialogController);
    function CatalogDeleteDialogController($mdDialog, dialog, id, provider) {
        var vm = this;

        vm.dialog = dialog;
        vm.id = id;
        vm.CatalogProvider = provider;

        //Functions
        vm.confirm = confirm;
        vm.cancel = cancel;
                
        function confirm() {
        vm.removeLoader = vm.CatalogProvider
            .remove(vm.id)
            .then(function () {
                $mdDialog.hide();
            })
            .catch(function (removeError) {
                $mdDialog.cancel(removeError);
            });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

}) ();
