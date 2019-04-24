(function () {
    'use strict';

    angular
        .module('app')
        .factory('atencionPV', atencionPV);

    function atencionPV(
        API,
        URLS) {
        var baseUrl = API.all(URLS.salepoint.base);
        //TODO: change logic to use the new assets endpoints
        //var insumosURL = API.all(URLS.mobile.base).all(URLS.catalogo_insumos);

        var service = {
            getByID: getByID,
            getAll: getAll,
            getInsumos: getInsumos,
            putActualiza: putActualiza,
            getReport: getReport
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getReport(id) {
            return baseUrl.all('report').all(id).customGET();
        }
        function getAll() {
            return baseUrl.getList();
        }

        function getInsumos() {
            //TODO: change logic to use the new assets functionality and endpoints
            //return insumosURL.all(economico).getList();
        }

        function putActualiza(id, data) {
            return baseUrl.all(id).customPUT(data);
        }

        return service;
    }

})();
