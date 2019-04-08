/**
 * Created by franciscojaviercerdamartinez on 4/4/19.
 */


(function () {

    angular
        .module('app.mainApp')
        .component('retireUniqueAsset', {
            templateUrl: 'app/mainApp/technical_service/components/retireUniqueAsset/retireUniqueAsset.tmpl.html',
            controller: retireUniqueAssetController,
            bindings: {
                barcode: '<',
                sucursal: '<'

            }
        });
    function retireUniqueAssetController(Translate, ErrorHandler, $mdDialog, URLS, retireUniqueAssetProvider) {
        var vm = this;

        getUniqueAssets();

        vm.salvageAsset=salvageAsset;
        vm.discardAsset=discardAsset;

        function getUniqueAssets(){
            console.log(vm.barcode);
            console.log(vm.sucursal);
            var promiseUniqueAssetList = retireUniqueAssetProvider.getUniqueAssetsListByCabinet(vm.barcode);
            promiseUniqueAssetList.then(function (uniqueAssets) {
                vm.unique_asset_list=uniqueAssets.results;

            }).catch(function (errormsg) {
                console.log(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }
        function salvageAsset() {
            var body = {
                disponible: true
            };
        }function discardAsset() {
            var body = {
                disponible: false
            };
        }



    }
})();
