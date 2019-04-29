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
    function retireUniqueAssetController(Translate, ErrorHandler, $mdDialog, URLS, retireUniqueAssetProvider, $log) {
        var vm = this;

        getUniqueAssets();

        vm.salvageAsset = salvageAsset;
        vm.discardAsset = discardAsset;

        function getUniqueAssets() {
            $log.debug(vm.barcode);
            $log.debug(vm.sucursal);
            var promiseUniqueAssetList = retireUniqueAssetProvider.getUniqueAssetsListByCabinet(vm.barcode);
            promiseUniqueAssetList.then(function (uniqueAssets) {
                vm.unique_asset_list = uniqueAssets.results;

            }).catch(function (errormsg) {
                $log.debug(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function salvageAsset() {
            var body = {
                disponible: true
            };
            var promiseRemoveUnique = retireUniqueAssetProvider.removeUniqueAsset(body, vm.barcode);
            promiseRemoveUnique.then(function (response) {
                $log.debug(response);
            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function discardAsset() {
            var body = {
                disponible: false
            };
            var promiseRemoveUnique = retireUniqueAssetProvider.removeUniqueAsset(body, vm.barcode);
            promiseRemoveUnique.then(function (response) {
                $log.debug(response);
            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });
        }


    }
})();
