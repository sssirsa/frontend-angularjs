/* 
 *      dialog:{              //Labels to use in the creation dialog
 *          title: string,          (Optional) Title for the creation dialog, default is 'Search element'
 *          searchButton: string,   (Optional) Label for the Search button, default is 'Search'
 *          loadingText: string     (Optional) Text to show in the Loading, default is "Please wait..."
 *      },
 *      id: string            //Object identifier to be removed
*/


(function () {
    angular
        .module('app.mainApp')
        .controller('CatalogDeleteDialogController', CatalogDeleteDialogController);
    function CatalogDeleteDialogController(
        $mdDialog,
        dialog,
        id,
        CATALOG
    ) {
        var vm = this;

        vm.dialog = dialog;
        vm.id = id;
        vm.CatalogProvider = CATALOG;

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
