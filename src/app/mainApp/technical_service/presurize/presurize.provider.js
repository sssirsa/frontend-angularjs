/**
 * Created by franciscojaviercerdamartinez on 4/12/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('presurizeProvider', presurizeProvider);

    /* @ngInject */
    function presurizeProvider($q,
                              URLS,
                              API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            makePressurize:makePressurize

        };


        function makePressurize(body,id) {
            return urlrepair.all(URLS.technical_service.services.pressurize).all(id).customPATCH(body);
        }


    }
})();
