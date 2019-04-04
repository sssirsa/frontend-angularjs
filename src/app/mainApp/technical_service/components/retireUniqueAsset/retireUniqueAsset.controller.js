/**
 * Created by franciscojaviercerdamartinez on 4/4/19.
 */
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
                barcode: '<',
                sucursal: '<'

            }
        });
    function uniqueAssetController(Translate, ErrorHandler, $mdDialog, URLS) {
        var vm = this;

    }
})();
