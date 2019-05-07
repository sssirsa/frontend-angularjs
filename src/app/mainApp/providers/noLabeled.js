(function () {
    'use strict';

    angular
        .module('app')
        .factory('noLabeled', noLabeled);

    /* @ngInject */
    function noLabeled(
        $q,
        MANAGEMENT,
        URLS,
        $http,
        API
    ) {

        var urlbase = API.all(URLS.management.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.unrecognizable_cabinet);

        return {
            create: create,
            getByID: getByID,
            list: list,
            update: update,
            dlete: dlete,
            lebeled: lebeled
        };

        function create(data) {
            return urlbase.customPOST(data);
        }

        function getByID(id) {
            return urlbase.all(id).customGET();
        }

        function list(limit, offset, querySet) {
            if (angular.isDefined(limit) && angular.isDefined(offset)) {
                if (angular.isUndefined(querySet)) {
                    return API.all(URLS.management.base)
                        .all(URLS.management.inventory.base)
                        .all(URLS.management.inventory.unrecognizable_cabinet + '?limit=' + limit + '&offset=' + offset).customGET();
                }
                else {
                    return API.all(URLS.management.base)
                        .all(URLS.management.inventory.base)
                        .all(URLS.management.inventory.unrecognizable_cabinet + '?limit=' + limit + '&offset=' + offset + '&' + querySet).customGET();
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
            return urlbase.customDELETE(economico, null, { 'content-type': 'application/json' });
        }

        function lebeled(data) {
            var url = API.all(URLS.management.base)
                .all(URLS.management.inventory.base)
                .all(URLS.management.inventory.label);
            return url.customPOST(data);
        }

    }
})();
