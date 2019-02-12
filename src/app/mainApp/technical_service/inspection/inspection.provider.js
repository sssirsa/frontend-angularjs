/**
 * Created by franciscojaviercerdamartinez on 2/12/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('inspectionProvider', inspectionProvider);

    /* @ngInject */
    function inspectionProvider($q,
                                       URLS,
                                       API) {

        var urlbase = API.all(URLS.entries_departures.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.cabinet);

        return {
            makeInspection: makeInspection,
            makePrecheck: makePrecheck,
            makeChecklist:makeChecklist
        };


        function makeInspection(body,id) {
            return urlbase.all(id).customPATCH();
        }

        function makePrecheck(body) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all(id_servicio).customPOST();
        }

        function makeChecklist(body) {
            return technicalServiceBase.all(URLS.technical_service.services.service).all('?cabinet_economico='+economico).customPOST();
        }



    }
})();
