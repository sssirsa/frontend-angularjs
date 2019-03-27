/* 
 *      dialog:{              //Labels to use in the creation dialog
 *          title: string,          (Optional) Title for the creation dialog, default is 'Search element'
 *          searchButton: string,   (Optional) Label for the Search button, default is 'Search'
 *          loadingText: string     (Optional) Text to show in the Loading, default is "Please wait..."
 *      },
 *      id: string,           //Object identifier to be removed
 *      provider: CATALOG provider object,
 *
*      PROVIDER = {        //Every function must return a promise, the URL must be defined when the provider object is given
 *                         //The Delete dialog just uses the "remove" function of the provider
           url: null,
           getByID: function (id) {...},
           list: function () {...},
           create: function (object) {...},
           update: function (id, object) {...},
           remove: function (id) {...},
           search: function (query) {...}
           }
*/


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
