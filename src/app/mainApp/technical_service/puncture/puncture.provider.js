/**
 * Created by franciscojaviercerdamartinez on 2/13/19.
 */
/**
 * Created by franciscojaviercerdamartinez on 2/13/19.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('punctureProvider', punctureProvider);

    /* @ngInject */
    function punctureProvider($q,
                              URLS,
                              API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            makePuncture:makePuncture

        };


        function makePuncture(id) {
            return urlrepair.all(URLS.technical_service.services.service).all(id).customGET();
        }


    }
})();
