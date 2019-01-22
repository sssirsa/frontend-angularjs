/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .factory('searchCabinetStep', searchCabinetStep);

    /* @ngInject */
    function cabinetUC(
        $q,
        MANAGEMENT,
        URLS,
        $http,
        API
    ) {

        var urlbase = API.all(URLS.management.base).all(MANAGEMENT.project.inventory + URLS.cabinet_unilever);

        return {
            getByID:getByID
        };



        function getByID(id) {
            return urlbase.all(id).customGET();
        }

    }
})();
