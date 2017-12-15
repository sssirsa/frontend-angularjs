/**
 * Created by Luis Olvera on 19/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Solicitudes',Solicitudes);

    function Solicitudes($q, Restangular, EnvironmentConfig, URLS){
        var urlbase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                urlbase = Restangular.all(URLS.environment.genesis_dev).all('solicitud');
                break;
            case 'staging':
                urlbase = Restangular.all(URLS.environment.genesis_stg).all('solicitud');
                break;
            case 'production':
                urlbase = Restangular.all(URLS.environment.genesis).all('solicitud');
                break;
            case 'local':
                urlbase = Restangular.all(URLS.environment.genesis_local).all('solicitud');
                break;
        }

        return{
            create:create,
            list:list,
            modify:modify,
            consultaEsp:consultaEsp
        };

        function create(object){
            // var deferred=$q.defer();
            //
            // Restangular.all('solicitud').customPOST(object).then(function(rest){
            //     deferred.resolve(rest);
            // }).catch(function(error){
            //     deferred.reject(error);
            // });
            // return deferred.promise;
            return urlbase.customPOST(object);
        }

        function list(){
            // return Restangular.all('solicitud').customGET();
            return urlbase.customGET();
        }

        function modify(object){
            // var deferred=$q.defer();//Genera la promesa
            // Restangular.one('solicitud',object.id).customPUT(object).then(function(resp){
            //     deferred.resolve(resp);
            // }).catch(function(error){
            //     deferred.reject(error);
            // });
            // return deferred.promise;
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
            // return Restangular.one('solicitud', tipoConsulta).customGET();
            return urlbase.all(tipoConsulta).customGET();
        }

    }
})();
