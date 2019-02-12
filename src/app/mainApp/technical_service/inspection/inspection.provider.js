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
            .all(URLS.technical_service.inspections.base);
        var urlrepair=API.all(URLS.technical_service.base)
            .all(URLS.technical_service.services.base);

        return {
            makeInspection: makeInspection,
            makePrecheck: makePrecheck,
            makeChecklist:makeChecklist
        };


        function makeChecklist(body,id) {
            return urlrepair.all(URLS.technical_service.services.checklist).all(id).customPATCH(body);
        }

        function makePrecheck(body) {
            return urlbase.all(URLS.technical_service.inspections.pre_checklist).customPOST(body);
        }

        function makeInspection(body) {
            return urlbase.all(URLS.technical_service.inspections.preliminary_inspection).customPOST(body);
        }



    }
})();
