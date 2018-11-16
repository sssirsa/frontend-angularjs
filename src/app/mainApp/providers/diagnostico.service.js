(function() {
    'use strict';

    angular
        .module('app')
        .factory('Diagnostico', ['WebRestangular', Diagnostico]);

    /* @ngInject */
    function Diagnostico(WebRestangular, URLS) {
        var diagnosticoBase = WebRestangular.all(URLS.diagnostico);

        var diagnosticoCabinetBase = WebRestangular.all(URLS.diagnostico_cabinet);

        return {
            create: create,
            get: get,
            getAllByCabinet: getAllByCabinet,
            remove: remove,
            modify: modify,
            lastDiagnosticInput:lastDiagnosticInput,
            lastDiagnosticOutput:lastDiagnosticOutput
        };

        function lastDiagnosticInput(id) {
            return diagnosticoBase.one('latest',id).customGET();
        }
        function lastDiagnosticOutput(id) {
            return diagnosticoBase.one('latest_salida',id).customGET();
        }
        function create(request) {
            return diagnosticoCabinetBase.customPOST(request);
        }

        function get(id) {
            return diagnosticoCabinetBase.all(id).customGET();
        }

        function getAllByCabinet(id) {
            return diagnosticoBase.one('all',id).customGET();
        }

        function remove(id) {
            return diagnosticoCabinetBase.all(id).customDELETE();
        }

        function modify(request) {
            return diagnosticoCabinetBase.all(request.id).customPUT(request);
        }
    }
})();