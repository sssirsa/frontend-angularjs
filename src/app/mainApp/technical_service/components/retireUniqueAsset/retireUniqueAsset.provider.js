/**
 * Created by franciscojaviercerdamartinez on 4/4/19.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('retireUniqueAssetProvider', retireUniqueAssetProvider);

    /* @ngInject */
    function retireUniqueAssetProvider($q,
                                 URLS,
                                 API) {


        var urlbase =API.all(URLS.inventory.base)
            .all(URLS.inventory.management.base);


        return {

            getUniqueAssetsListByCabinet:getUniqueAssetsListByCabinet,
            removeUniqueAsset:removeUniqueAsset

        };



        function getUniqueAssetsListByCabinet(economico) {
            var filter='?cabinet__economico='+economico;
            return urlbase.all(URLS.inventory.catalogues.unique_asset+filter).customGET();
        }

        function removeUniqueAsset(uniqueAsset,id) {
            return urlbase.all(URLS.inventory.management.recover_asset).all(id).customPUT(uniqueAsset);
        }



    }
})();
