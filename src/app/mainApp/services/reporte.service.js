/**
 * Created by franciscojaviercerdamartinez on 25/06/17.
 */

(function () {
    "use strict";

    angular
        .module("app")
        .factory("Reporte", Reporte);

    /* @ngInject */
    function Reporte(Restangular) {
        var path = Restangular.all("reports/insumos");

        return {
            reporteInsumos: reporteInsumos
        };
        function reporteInsumos(object) {
            return path.post(object);
        }
    }
})();
