/**
 * Created by franciscojaviercerdamartinez on 3/21/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('uniqueAssetProvider', uniqueAssetProvider);

    /* @ngInject */
    function uniqueAssetProvider($q,
                            URLS,
                            API) {


        var urlbase =API.all(URLS.inventory.base)
            .all(URLS.inventory.management.base);

        return {

            getUniqueAssetsList:getUniqueAssetsList

        };



        function getUniqueAssetsList(barcode) {
            console.log(barcode);
            var filter='?no_serie__contains='+barcode;

            console.log(filter);
            return urlbase.all(URLS.inventory.catalogues.unique_asset+filter).customGET();
        }



    }
})();
