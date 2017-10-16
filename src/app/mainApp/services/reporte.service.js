/**
 * Created by franciscojaviercerdamartinez on 25/06/17.
 */

(function () {
    "use strict";

    angular
        .module("app")
        .factory("Reporte", Reporte);

    /* @ngInject */
    function Reporte(Restangular, EnvironmentConfig, URLS) {
        //var path = Restangular.all("reports/insumos");

        var path = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                path = Restangular.all(URLS.environment.genesis_dev).all('reports/insumos');
                break;
            case 'staging':
                path = Restangular.all(URLS.environment.genesis_stg).all('reports/insumos');
                break;
            case 'production':
                path = Restangular.all(URLS.environment.genesis).all('reports/insumos');
                break;
            case 'local':
                path = Restangular.all(URLS.environment.genesis_local).all('reports/insumos');
                break;
        }

        return {
            reporteInsumos: reporteInsumos
        };
        function reporteInsumos(object) {
            return path.post(object);
        }
    }
})();
