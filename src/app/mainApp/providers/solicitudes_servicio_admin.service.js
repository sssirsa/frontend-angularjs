/**
 * Created by Luis Olvera on 19/07/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitud_Servicio_Admin', Solicitud_Servicio_Admin);

    function Solicitud_Servicio_Admin(
        API,
        URLS
    ) {
        // var base = base;
        var base =  API.all(URLS.genesis.base).all(URLS.solicitudes.servicio_admin);

        return {
            create: create,
            list: list,
            updateSolicitud: updateSolicitud,
            borrarSolVenta: borrarSolVenta,
            getOne: getOne
        };

        function create(object) {
            return base.customPOST(object);
        }

        function list() {
            return base.customGET();
        }

        function getOne(id) {
            return base.get(id);
        }

        function borrarSolVenta(object) {
            return base.all(object).customDELETE(undefined, undefined, {'Content-Type': 'application/json'});
        }

        function updateSolicitud(request) {
            return base.all(request.id).customPUT(request);
        }

    }
})();
