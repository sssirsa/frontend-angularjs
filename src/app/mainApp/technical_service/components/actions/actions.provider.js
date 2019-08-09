/**
 * Created by franciscojaviercerdamartinez on 3/11/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('actionProvider', actionProvider);

    /* @ngInject */
    function actionProvider($q,
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
