/**
 * Created by franciscojaviercerdamartinez on 3/20/19.
 */
/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('uniqueAsset', {
            templateUrl: 'app/mainApp/technical_service/components/uniqueAsset/uniqueAsset.tmpl.html',
            controller: uniqueAssetController,
            bindings: {
                uniqueAssetLoaded: '&',
                uniqueAssetSelected: '<',
                actions: '<'

            }
        });
    function uniqueAssetController(Translate, ErrorHandler, uniqueAssetProvider) {
        var vm = this;
        vm.search_unique_asset=search_unique_asset;
        function search_unique_asset(){
            uniqueAssetProvider.getUniqueAssetsList(vm.barcode);
        }

    }
})();
