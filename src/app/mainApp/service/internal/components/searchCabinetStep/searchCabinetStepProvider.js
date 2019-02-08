/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('searchCabinetStepProvider', searchCabinetStepProvider);

    /* @ngInject */
    function searchCabinetStepProvider($q,
                                       URLS,
                                       API,
                                       EnvironmentConfig) {

        var urlbase = API.all(URLS.management.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.cabinet);
        var technicalServiceBase=  (EnvironmentConfig.site.rest.api).all( URLS.technical_service.base).all(URLS.technical_service.services.base);
        return {
            getByID: getByID,
            getServiceById: getServiceById,
            getAllServicesByCabinet:getAllServicesByCabinet,
            getCurrentStage:getCurrentStage
        };


        function getByID(id) {
            return urlbase.all(id).customGET();
        }

        function getServiceById(id_servicio) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all(id_servicio);
        }
        function getAllServicesByCabinet(economico) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all('?cabinet_economico='+economico);
        }
        function getCurrentStage(economico) {
            return technicalServiceBase.all(URLS.technical_service.services.current_stage).all(economico);
        }

    }
})();
