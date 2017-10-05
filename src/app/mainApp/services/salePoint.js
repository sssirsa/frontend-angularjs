(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePoint', SalePoint);

    function SalePoint(Restangular, EnvironmentConfig, URLS) {
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUrl = Restangular.all(URLS.environment.mobile_dev);
                break;
            case 'staging':
                baseUrl = Restangular.all(URLS.environment.mobile_stg);
                break;
            case 'production':
                baseUrl = Restangular.all(URLS.environment.mobile);
                break;
            case 'local':
                baseUrl = Restangular.all(URLS.environment.mobile_local);
                break;
        }

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
            return baseUrl.all('list_atencion').all('').getList();
        }

        function listAttendedServices() {
            return baseUrl.all('list_atendido_pv').all('').getList();
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
