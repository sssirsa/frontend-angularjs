/**
 * Created by Luis Olvera on 19/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitud_Servicio',Solicitud_Servicio);

    function Solicitud_Servicio(WebRestangular, URLS){
        // var baseURL = baseURL;
        var baseURL =  WebRestangular.all(URLS.solicitudes.servicio);

        return{
            create:create,
            list:list,
            updateSolicitud:updateSolicitud,
            borrarSolVenta:borrarSolVenta,
            postEntradaMasiva:postEntradaMasiva
        };

        function postEntradaMasiva(data) {
            return baseURL.all(URLS.mass_upload).withHttpConfig({transformRequest: angular.identity}).customPOST(data, "", {}, {'Content-type': undefined});
        }

        function create(object){
            return baseURL.customPOST(object);
        }

        function list(){
            return baseURL.customGET();
        }


        function borrarSolVenta(object){
            return baseURL.all(object).customDELETE(undefined,undefined,{'Content-Type': 'application/json'});
        }

        function updateSolicitud(request) {
            return baseURL.all(request.id).customPUT(request);
        }

    }
})();
