//TODO: Delete this provider when doing the refactor
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitudes',Solicitudes);

    function Solicitudes(
        API,
        URLS
    ) {
        var urlbase = API.all(URLS.salepoint.base).all(URLS.salepoint.requests);

        return{
            create:create,
            list:list,
            modify:modify,
            consultaEsp:consultaEsp,
            report:report
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

        function report(id){
            return urlbase.one('report',id).get();
        }

    }
})();
