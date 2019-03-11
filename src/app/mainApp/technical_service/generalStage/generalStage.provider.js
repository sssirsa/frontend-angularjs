/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('stageProvider', stageProvider);

    /* @ngInject */
    function stageProvider($q,
                               URLS,
                               API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            sendStage:sendStage

        };

        function sendStage(id,body) {
            return urlrepair.all(URLS.technical_service.services.diagnose).all(id).customPATCH(body);
        }



    }
})();
