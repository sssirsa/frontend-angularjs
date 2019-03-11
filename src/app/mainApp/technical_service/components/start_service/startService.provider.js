/**
 * Created by franciscojaviercerdamartinez on 3/6/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('startServiceProvider', startServiceProvider);

    /* @ngInject */
    function startServiceProvider($q,
                              URLS,
                              API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            startStage:startStage,
            startDiagnosis:startDiagnosis,
            startPuncture:startPuncture,
            startPresurize:startPresurize

        };


        function startStage(id,body) {
            return urlrepair.all(URLS.technical_service.services.stage).all(id).customPATCH(body);
        }

        function startDiagnosis(id,body) {

            return urlrepair.all(URLS.technical_service.services.diagnose).all(id).customPATCH(body);
        }

        function startPuncture(id,body) {
            return urlrepair.all(URLS.technical_service.services.puncture).all(id).customPATCH(body);
        }

        function startPresurize(id,body) {
            return urlrepair.all(URLS.technical_service.services.pressurize).all(id).customPATCH(body);
        }



    }
})();
