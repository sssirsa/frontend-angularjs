/**
 * Created by Emmanuel on 24/08/2016.
 */
(function () {

    'use strict';

    angular
        .module('app.mainApp')
        .factory('EntradaSalida', EntradaSalida);

    function EntradaSalida(WebRestangular, URLS) {
        var baseURL = WebRestangular.all(URLS.entrada_salida);

        return {
            postEntrada: postEntrada,
            postEntradaMasiva: postEntradaMasiva,
            postSalidaMasiva: postSalidaMasiva,
            putEntradaMasiva: putEntradaMasiva,
            getLastEntradaByCabinet: getLastEntradaByCabinet,
            byUdn: byUdn,
            byUdnObject: byUdnObject,
            getCabinetsEntrada: getCabinetsEntrada,
            normalizeCabinets: normalizeCabinets,
            getRemision: getRemision,
            getAll: getAll,
            getSalidas: getSalidas,
            getCabinetsEntradaSalida: getCabinetsEntradaSalida
        };

        function getSalidas() {
            return baseURL.all(URLS.salida).getList();
        }

        function getAll() {
            return baseURL.getList().$object;
        }

        function getRemision(idEntradaSalida) {
            return baseURL.one(URLS.remision).customGET(idEntradaSalida);
        }

        function normalizeCabinets(idEntradaSalida) {
            //one('normalize',idEntradaSalida)
            return baseURL.one(URLS.normalize_cabinets, idEntradaSalida).put();

        }

        function getLastEntradaByCabinet(idCabinet) {
            return baseURL.one(URLS.cabinet).customGET(idCabinet);
        }

        //entrada_salida
        function postEntrada(data) {
            return baseURL.withHttpConfig({transformRequest: angular.identity}).customPOST(data, "", {}, {'Content-type': undefined});
        }

        //entrada_salida/mass_upload
        function postEntradaMasiva(data) {
            return baseURL.all(URLS.entrada_masiva).withHttpConfig({transformRequest: angular.identity}).customPOST(data, "", {}, {'Content-type': undefined});
        }

        //entrada_salida/mass_upload
        function putEntradaMasiva(data, pk) {
            return baseURL.one(URLS.entrada_masiva, pk).withHttpConfig({transformRequest: angular.identity}).customPUT(data, "", {}, {'Content-type': undefined});
        }

        function postSalidaMasiva(data) {
            return baseURL.all(URLS.salida_masiva).withHttpConfig({transformRequest: angular.identity}).customPOST(data, "", {}, {'Content-type': undefined});
        }

        function byUdn(id) {
            return baseURL.one(URLS.udn, id).getList().$object;
        }

        function byUdnObject(id) {
            return baseURL.one(URLS.udn, id).getList();
        }

        function getCabinetsEntrada() {
            return baseURL.all(URLS.cabinet_entrada).getList();
        }

        function getCabinetsEntradaSalida(id) {
            return baseURL.all(URLS.cabinets).all(id).getList();
        }
    }
})();
