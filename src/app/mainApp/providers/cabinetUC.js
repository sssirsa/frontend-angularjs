(function() {
    'use strict';

    angular
        .module('app')
        .factory('cabinetUC', cabinetUC);

    /* @ngInject */
    function cabinetUC($q, MANAGEMENT, URLS, $http) {

        var urlbase = MANAGEMENT.baseManagement + MANAGEMENT.project.inventory + URLS.cabinet_unilever;

        return {
            create: create,
            getByID:getByID,
            list: list,
            update: update,
            dlete: dlete
        };

        function create(data){
            console.log(urlbase, data);
            $http.post(
                urlbase, data)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (errorResponse) {
                    return errorResponse;
                });
        }

        function getByID(id) {
            return urlbase.all(id).customGET();
        }

        function list(limit, offset, querySet){
            if(limit !== undefined && offset !== undefined){
                if (querySet === undefined) {
                    return urlbase.all('?limit='+limit+'&offset='+offset).customGET();
                }
                else {
                    return urlbase.all('?limit='+limit+'&offset='+offset+'&'+querySet).customGET();
                }
            }
            else {
                return urlbase.customGET();
            }

        }

        function update(economico, data) {
            return urlbase.all(economico).customPUT(data);
        }

        function dlete(economico) {
            return urlbase.customDELETE(economico,null,{'content-type':'application/json'});
        }
    }
})();
