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
                                       API) {

        var urlbase = API.all(URLS.management.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.cabinet);
        var technicalServiceBase=API.all( URLS.technical_service.base).all(URLS.technical_service.services.base);
        var infoTipoEtapa=API.all(URLS.management.base);

        return {
            getByID: getByID,
            getServiceById: getServiceById,
            getAllServicesByCabinet:getAllServicesByCabinet,
            getCurrentStage:getCurrentStage,
            getEntrie:getEntrie
        };


        function getByID(id) {
            return urlbase.all(id).customGET();
        }

        function getServiceById(id_servicio) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all(id_servicio).customGET();
        }

        function getAllServicesByCabinet(economico) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all('?cabinet_economico='+economico).customGET();
        }

        function getCurrentStage(economico) {
            return technicalServiceBase.all(URLS.technical_service.services.current_stage).all(economico).customGET();
        }

        function getEntrie(economico){
            return  infoTipoEtapa.all(URLS.management.control.base).all(URLS.management.control.cabinet_in_subsidiary).all(economico).customGET();
        }

    }
})();
