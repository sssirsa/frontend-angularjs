(function(){
    'use strict';

    angular
        .module('app')
        .factory('ServiceAssign',ServiceAssign);

    function ServiceAssign (Restangular){
        var api = 'http://genesis-mobile-dev.sssirsa.com:8000';
        var baseUrl = Restangular.allUrl('',api);
        var service ={
            listUnasignedServices:listUnasignedServices,
            listAttendedServices:listAttendedServices,
            assignToPerson:assignToPerson
        };

        function listUnasignedServices() {
            return baseUrl.all('list_atencion');
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
