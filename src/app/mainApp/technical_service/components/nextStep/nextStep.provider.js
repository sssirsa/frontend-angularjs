/**
 * Created by franciscojaviercerdamartinez on 2/26/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('nextStageProvider', nextStageProvider);

    /* @ngInject */
    function nextStageProvider($q,
                                URLS,
                                API) {

        var urlbase = API.all(URLS.technical_service.base)
            .all(URLS.technical_service.catalogues.base);

        return {

            getStage:getStage

        };


        function getStage(id) {
            return urlbase.all(URLS.technical_service.catalogues.stage).all(id).customGET();
        }



    }
})();
