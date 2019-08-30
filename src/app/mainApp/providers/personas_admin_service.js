(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Persona_Admin', Persona_Admin);

    function Persona_Admin(
        API,
        URLS
    ) {

        var baseModelo = API.all(URLS.management.base
            + '/' + URLS.management.administration.base
            + '/' + URLS.management.administration.person.admin);
        var manageSystem = API.all(URLS.management.base
            + '/' + URLS.management.administration.base);

        return {
            list: list,
            update: update,
            create: create,
            createObject: createObject,
            get: get,
            deleteData: remove,
            modify: modify,
            listPromise: listPromise
        };

        function createObject(data) {
            var form_data = new FormData();

            form_data.append('user', angular.toJson(data.user));
            form_data.append('nombre', data.nombre);
            form_data.append('apellido_paterno', data.apellido_paterno);
            if (data.apellido_materno) {
                form_data.append('apellido_materno', data.apellido_materno);
            }
            form_data.append('direccion', data.direccion);
            form_data.append('telefono', data.telefono);
            form_data.append('ife', data.ife);
            form_data.append('foto', data.foto);
            if (angular.isDefined(data.sucursal))
                form_data.append('sucursal', data.sucursal);


            //var defer= $q.defer();
            return baseModelo
                .withHttpConfig({ transformRequest: angular.identity })
                .customPOST(form_data, "", {}, { 'Content-Type': undefined });
            //.then(function(res){
            //    defer.resolve(res);
            //}).catch(function(err){
            //    defer.reject(err);
            //});
            //return defer.promise;
        }

        function get(id) {
            return baseModelo.get(id);
        }

        /*function list(limit, offset, filter) {
            var params = {nombre__icontains: filter};
            return API.all(URLS.management.base
                + '/' + URLS.management.administration.base)
                .customGET(URLS.management.administration.person, params);
        }*/
        function list(limit, offset, filter) {
            return API.all(URLS.management.base
                + '/' + URLS.management.administration.base + '/' +
                URLS.management.administration.person + '?nombre__icontains=' + filter +'&user__email__not')
                .customGET();
        }

        function update(object) {
            return baseModelo.all(object.id).customPUT(object);
        }

        function create(object) {
            return baseModelo.post(object);
        }

        function remove(object) {
            return baseModelo.customDELETE(object.id, null, { 'content-type': 'application/json' });
        }

        function modify(object) {
            return baseModelo.all(object.id).customPUT(object, null, { 'content-type': 'application/json' });
        }

        function listPromise(limit, offset) {
            //return baseModelo.customGET('?limit=' + limit + '&offset=' + offset);
            return manageSystem
                .all(URLS.management.administration.employees
                    + '?limit=' + limit + '&offset=' + offset)
                .customGET();
        }

    }
})();
