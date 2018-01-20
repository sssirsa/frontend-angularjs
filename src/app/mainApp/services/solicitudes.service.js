/**
 * Created by Luis Olvera on 19/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitudes',Solicitudes);

    function Solicitudes(MobileRestangular, URLS){
        var urlbase = MobileRestangular.all(URLS.solicitud_pv);

        return{
            create:create,
            list:list,
            modify:modify,
            consultaEsp:consultaEsp
        };

        function create(object){
            return urlbase.customPOST(object);
        }

        function list(){
            return urlbase.customGET();
        }

        function modify(object){
            return urlbase.all(object.id).customPUT(object);
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
            }
            return urlbase.all(tipoConsulta).customGET();
        }

    }
})();
