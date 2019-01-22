/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .factory('searchCabinetStepProvider', searchCabinetStepProvider);

    /* @ngInject */
    function searchCabinetStepProvider(
        $q,
        MANAGEMENT,
        URLS,
        $http,
        API
    ) {

        var urlbase = API.all(URLS.management.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.cabinet);

        return {
            getByID:getByID
        };



        function getByID(id) {
            return urlbase.all(id).customGET();
        }

    }
})();
