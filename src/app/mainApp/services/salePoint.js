(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePoint', SalePoint);

    function SalePoint(MobileRestangular, URLS) {
        var baseUrl = MobileRestangular;

        var service = {
            getByID: getByID,
            listUnasignedServices: listUnasignedServices,
            listAttendedServices: listAttendedServices,
            assignToPerson: assignToPerson,
            assignedTo: assignedTo,
            getStore: getStore
        };

        function getByID(id) {
            return baseUrl.one('atencion_pv', id).customGET();
        }

        function listUnasignedServices() {
            return baseUrl.all('list_atencion').getList();
        }

        function listAttendedServices() {
            return baseUrl.all('list_atendido_pv').getList();
        }

        function assignToPerson(personID, serviceID) {
            return baseUrl.all('asignar_pv').all(serviceID).customPUT({persona: personID});
        }

        function assignedTo(personID) {
            return baseUrl.one('list_atencion', personID).getList();
        }

        function getStore(id) {
            return baseUrl.one('establecimiento', id).customGET();
        }

        return service;
    }

})();
