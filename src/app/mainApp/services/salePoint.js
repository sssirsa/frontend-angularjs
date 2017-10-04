(function(){
    'use strict';

    angular
        .module('app')
        .factory('SalePoint',SalePoint);

    function SalePoint (Restangular){
        //var api = 'http://genesis-mobile-dev.sssirsa.com:8000';
        var baseUrl = Restangular.all('mobile');

        var service ={
            listUnasignedServices:listUnasignedServices,
            listAttendedServices:listAttendedServices,
            assignToPerson:assignToPerson,
            assignedTo:assignedTo
        };

        function listUnasignedServices() {
            return baseUrl.all('list_atencion').getList();
        }

        function listAttendedServices() {
            return baseUrl.all('list_atendido_pv').getList();
        }

        function assignToPerson(personID, serviceID) {
            return baseUrl.all('asignar_pv').all(serviceID).customPUT({persona:personID});
        }

        function assignedTo(personID){
            return baseUrl.one('list_atencion',personID).getList();
        }

        return service;
    }

})();
