(function () {
    'use strict';

    angular
        .module('app')
        .factory('atencionPV', atencionPV);

    function atencionPV(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular.all(URLS.atencion_pv);
        var insumosURL=MobileRestangular.all(URLS.catalogo_insumos);

        var service = {
            getByID: getByID,
            getAll: getAll,
            getInsumos: getInsumos
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll() {
            return baseUrl.getList();
        }

        function getInsumos(economico) {
            return insumosURL.all(economico + '?limit=100&offset=0').customGET();
        }

        return service;
    }

})();
