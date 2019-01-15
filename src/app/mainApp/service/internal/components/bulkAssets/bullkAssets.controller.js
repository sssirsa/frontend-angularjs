/**
 * Created by franciscojaviercerdamartinez on 1/10/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('bulkAsset', {
            templateUrl: 'app/mainApp/service/internal/components/bulkAssets/bulkAssets.tmpl.html',
            controller: bulkAssetsController,
            bindings: {
                max_stock: '<',
                bulkAsset:'<',
                bulkAssetSelected: '&'
            }
        });

    function bulkAssetsController(){

        var vm = this;


    }
})();
