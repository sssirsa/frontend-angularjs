(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('preRequests', preRequests);

    function preRequests(
        API,
        $window,
        URLS) {
        var baseUrl=API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest);
        var service = {
            getByID: getByID,
            getAll: getAll,
            create:create,
            createRequest:createRequest,
            update:update
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (angular.isUndefined(filter)) {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
            }
        }

        function createRequest (element){
            return baseUrl.all('solicitud').post(element);
        }
        function create (element){
            return baseUrl.post(element);
        }
        function update(element) {
            return baseUrl.all(element.id).customPUT(element);
        }

        return service;
    }

})();
