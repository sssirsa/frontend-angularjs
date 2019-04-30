(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePoint', SalePoint);

    function SalePoint(
        API,
        URLS
    ) {

        var baseUrl = API.all(URLS.salepoint.base);

        var service = {
            getByID: getByID,
            listUnasignedServices: listUnasignedServices,
            listAsignedService: listAsignedService,
            listAllServices: listAllServices,
            assignToPerson: assignToPerson,
            assignedTo: assignedTo,
            getStore: getStore
        };

        function getByID(id) {
            return baseUrl.one('atencion_pv', id).customGET();
        }

        function listUnasignedServices(limit, offset) {
            return baseUrl.all('list_atencion?limit=' + limit + '&offset=' + offset).customGET();
        }

        function listAsignedService(limit, offset) {
            return baseUrl.all('list_atencion').all('reasign_list?limit=' + limit + '&offset=' + offset).customGET();
        }

        function listAllServices(limit, offset, filter) {
            if (angular.isUndefined(filter)) {
                return baseUrl.all('atencion_pv' + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return baseUrl.all('atencion_pv' + '?limit=' + limit + '&offset=' + offset + '&' + filter).customGET();
            }
        }

        function assignToPerson(object, serviceID) {
            return baseUrl.all('asignar_pv').all(serviceID).customPUT(object);
        }

        function assignedTo(personID) {
            return baseUrl.one('list_atencion', personID).customGET();
        }

        function getStore(id) {
            return baseUrl.one('establecimiento', id).customGET();
        }

        return service;
    }

})();
