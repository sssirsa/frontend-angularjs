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

        var urlbase = API.all(URLS.inventory.base)
            .all(URLS.inventory.catalogues.base);

        return {

            getUniqueAssetsList:getUniqueAssetsList

        };


        
        function getUniqueAssetsList(barcode) {
            return urlbase.all(URLS.technical_service.catalogues.stage).all(id).customGET();
        }



    }
})();
