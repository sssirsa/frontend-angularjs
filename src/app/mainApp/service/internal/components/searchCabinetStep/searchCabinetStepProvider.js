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
        var infoTipoEtapa=(EnvironmentConfig.site.rest.api).all(URLS.technical_service.type_entrie.base);

        return {
            getByID: getByID,
            getServiceById: getServiceById,
            getAllServicesByCabinet:getAllServicesByCabinet,
            getCurrentStage:getCurrentStage,
            getEntrada:getEntrada
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

        function getEntrada(economico){

            return  infoTipoEtapa.all(URLS.technical_service.type_entrie.control).all(URLS.technical_service.type_entrie.cabinet_subsidiary).all(economico);
        }

    }
})();
