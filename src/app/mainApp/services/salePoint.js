(function(){
    'use strict';

    angular
        .module('app')
        .factory('SalePoint',SalePoint);

    function SalePoint (Restangular, EnvironmentConfig, URLS){
        var baseUrl = null;
        switch(EnvironmentConfig.environment){
            case 'development':
                baseUrl=Restangular.all(URLS.environment.mobile_dev);
                break;
            case 'staging':
                baseUrl=Restangular.all(URLS.environment.mobile_stg);
                break;
            case 'production':
                baseUrl=Restangular.all(URLS.environment.mobile);
                break;
            case 'local':
                baseUrl=Restangular.all(URLS.environment.mobile_local);
                break;
        }

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
