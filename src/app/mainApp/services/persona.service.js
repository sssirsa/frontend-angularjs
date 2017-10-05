/**
 * Created by Luis_Olvera on 23/08/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Persona', Persona);

    function Persona($q, Restangular, EnvironmentConfig, URLS) {
        //var baseUrl = Restangular.all('persona');
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUrl = Restangular.all(URLS.environment.genesis_dev).all('persona');
                break;
            case 'staging':
                baseUrl = Restangular.all(URLS.environment.genesis_stg).all('persona');
                break;
            case 'production':
                baseUrl = Restangular.all(URLS.environment.genesis).all('persona');
                break;
            case 'local':
                baseUrl = Restangular.all(URLS.environment.genesis_local).all('persona');
                break;
        }

        return {
            list: list,
            listProfile: listProfile,
            modify: modify,
            remove: remove,
            create: create,
            logInPusher: logInPusher
        };
        function logInPusher(request) {
            return Restangular.all('log_in').post(request);
        }


        function list() {
            return baseUrl.get().$object;
        }

        function listProfile() {
            return baseUrl.customGET();
        }

        function modify(data) {


            var form_data = new FormData();

            form_data.append('id', data.id);
            form_data.append('nombre', data.nombre);
            form_data.append('apellido_paterno', data.apellido_paterno);
            form_data.append('apellido_materno', data.apellido_materno);
            form_data.append('direccion', data.direccion);
            form_data.append('telefono', data.telefono);
            if (data.ife != null)
                form_data.append('ife', data.ife);
            if (data.foto != null)
                form_data.append('foto', data.foto);


            var defer = $q.defer();
            Restangular.one('persona', data.id).withHttpConfig({transformRequest: angular.identity}).customPUT(form_data, "", {}, {'Content-Type': undefined}).then(function (res) {
                defer.resolve(res);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;

        }

        function remove(object) {
            return baseUrl.customDELETE(object.id, null, {'content-type': 'application/json'});
        }

        function create(object) {
            return baseUrl.post(object);
        }


    }
})();
