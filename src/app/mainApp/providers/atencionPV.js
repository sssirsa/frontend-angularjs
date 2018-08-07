(function () {
    'use strict';

    angular
        .module('app')
        .factory('atencionPV', atencionPV);

    function atencionPV(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular.all(URLS.atencion_pv);

        var service = {
            getByID: getByID,
            getAll: getAll
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll() {
            return baseUrl.getList();
        }

        return service;
    }

})();
