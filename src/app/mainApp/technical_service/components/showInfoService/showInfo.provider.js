/**
 * Created by franciscojaviercerdamartinez on 2/13/19.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('showInfoProvider', showInfoProvider);

    /* @ngInject */
    function showInfoProvider($q,
                                URLS,
                                API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            getService:getService

        };


        function getService(id) {
            return urlrepair.all(URLS.technical_service.services.service).all(id).customGET();
        }


    }
})();
