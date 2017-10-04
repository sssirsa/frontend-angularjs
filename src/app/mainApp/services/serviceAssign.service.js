(function(){
    'use strict';

    angular
        .module('app')
        .factory('ServiceAssign',ServiceAssign);

    function ServiceAssign (Restangular){
        var api = 'http://genesis-mobile-dev.sssirsa.com:8000';
        var baseUrl = Restangular.allUrl('',api);

        var objects = [
            {
                "folio": 2,
                "solicitud": 10,
                "tipo_trabajo": "Cambio"
            },
            {
                "folio": 4,
                "solicitud": 12,
                "tipo_trabajo": "Retiro"
            },
            {
                "folio": 5,
                "solicitud": 13,
                "tipo_trabajo": "Medio"
            },
            {
                "folio": 8,
                "solicitud": 17,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 18,
                "solicitud": 32,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 16,
                "solicitud": 26,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 9,
                "solicitud": 19,
                "tipo_trabajo": "Cambio"
            },
            {
                "folio": 23,
                "solicitud": 38,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 24,
                "solicitud": 39,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 25,
                "solicitud": 40,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 26,
                "solicitud": 41,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 27,
                "solicitud": 42,
                "tipo_trabajo": "Cambio"
            },
            {
                "folio": 28,
                "solicitud": 43,
                "tipo_trabajo": "Retiro"
            },
            {
                "folio": 29,
                "solicitud": 44,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 30,
                "solicitud": 45,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 31,
                "solicitud": 46,
                "tipo_trabajo": "Alta"
            },
            {
                "folio": 32,
                "solicitud": 47,
                "tipo_trabajo": "Retiro"
            }
        ];

        var service ={
            listUnasignedServices:listUnasignedServices,
            listAttendedServices:listAttendedServices,
            assignToPerson:assignToPerson
        };

        function listUnasignedServices() {
            //return baseUrl.all('list_atencion');
            return objects;
        }

        function listAttendedServices() {
            return baseUrl.all('list_atendido_pv');
        }

        function assignToPerson(personID, serviceID) {
            return baseUrl.all('asignar_pv').all(serviceID).customPUT({persona:personID});
        }

        return service;
    }

})();
