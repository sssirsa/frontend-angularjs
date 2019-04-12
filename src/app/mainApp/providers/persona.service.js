(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Persona', Persona);

    function Persona(
        API,
        URLS,
        MANAGEMENT
    ) {
        var baseUrl = API.all(MANAGEMENT.base
            + '/' + MANAGEMENT.administration.base
            + '/' + MANAGEMENT.administration.person.base);

        return {
            list: list,
            listProfile: listProfile,
            modify: modify,
            remove: remove,
            create: create
        };


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


            return API.all(URLS.genesis.base)
                .one(URLS.persona, data.id)
                .withHttpConfig({transformRequest: angular.identity})
                .customPUT(form_data, "", {}, {'Content-Type': undefined});

        }

        function remove(object) {
            return baseUrl.customDELETE(object.id, null, {'content-type': 'application/json'});
        }

        function create(object) {
            return baseUrl.post(object);
        }


    }
})();
