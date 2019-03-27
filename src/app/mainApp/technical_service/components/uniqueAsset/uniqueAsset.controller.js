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
        vm.notDetected=[]
        vm.search_unique_asset=search_unique_asset;

        function search_unique_asset(){
           var promiseUniqueAssets= uniqueAssetProvider.getUniqueAssetsList(vm.barcode);
          promiseUniqueAssets.then(function (uniqueAssetsList) {
              vm.unique_asset_list=uniqueAssetsList.results;
              console.log(vm.unique_asset_list);
          }).catch(function(errormsg){
              console.log(errormsg);
              ErrorHandler.errorTranslate(errormsg);
          });
        }

    }
})();
