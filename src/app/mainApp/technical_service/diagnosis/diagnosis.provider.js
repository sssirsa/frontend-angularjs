/**
 * Created by franciscojaviercerdamartinez on 3/7/19.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('diagnosisProvider', diagnosisProvider);

    /* @ngInject */
    function diagnosisProvider($q,
                                  URLS,
                                  API) {

        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            sendDiagnosis:sendDiagnosis

        };

        function sendDiagnosis(id,body) {
            return urlrepair.all(URLS.technical_service.services.diagnose).all(id).customPATCH(body);
        }



    }
})();
