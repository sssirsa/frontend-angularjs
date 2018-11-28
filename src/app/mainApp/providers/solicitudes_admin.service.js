/**
 * Created by Luis_Olvera on 21/07/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitudes_Admin', Solicitudes_Admin);

    function Solicitudes_Admin(
        API,
        URLS
    ) {
        // var base=Restangular.all('solicitud_admin');
        var base = API.all(URLS.genesis.base).all(URLS.solicitudes.admin);

        return {
            list: list,
            consultaEsp: consultaEsp,
            consultaEspUnconfirmed: consultaEspUnconfirmed,
            updateSolicitud: updateSolicitud,
            create:create,
            borrarSol:borrarSol,
            getOne:getOne
        };

        function updateSolicitud(request) {
            return base.all(request.id).customPUT(request);
        }

        function consultaEsp(object) {
            var tipoConsulta = null;
            switch (object) {
                case "No Confirmada":
                    tipoConsulta = "unconfirmed";
                    break;
                case "Confirmada":
                    tipoConsulta = "confirmed";
                    break;
                case "Cancelada":
                    tipoConsulta = "canceled";
                    break;
                case "Cerrada":
                    tipoConsulta = "closed";
                    break;
            }
            return base.all(tipoConsulta).customGET();
        }

        function consultaEspUnconfirmed() {
            return base.all("unconfirmed").customGET();
        }

        function create(object){
            return base.customPOST(object);
        }

        function list(){
            return base.customGET();
        }

        function borrarSol(object){
            return base.all(object).customDELETE(undefined,undefined,{'Content-Type': 'application/json'});
        }
        function getOne(id) {
            return base.all(id).customGET();
        }
    }
})();
