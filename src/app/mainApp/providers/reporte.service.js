/**
 * Created by franciscojaviercerdamartinez on 25/06/17.
 */

(function () {
    "use strict";

    angular
        .module("app")
        .factory("Reporte", Reporte);

    /* @ngInject */
    function Reporte(
        API,
        URLS
    ) {
        var path = API.all(URLS.genesis.base).all(URLS.reporte_insumos);

        return {
            reporteInsumos: reporteInsumos
        };

        function reporteInsumos(object) {
            return path.post(object);
        }
    }
})();
