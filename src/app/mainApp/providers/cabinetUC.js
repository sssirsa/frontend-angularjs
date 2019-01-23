(function () {
    'use strict';

    angular
        .module('app')
        .factory('cabinetUC', cabinetUC);

    /* @ngInject */
    function cabinetUC(
        $q,
        MANAGEMENT,
        URLS,
        $http,
        API
    ) {

        var urlbase = API.all(URLS.management.base)
            .all(URLS.management.inventory.base)
            .all(URLS.management.inventory.cabinet);

        return {
            create: create,
            getByID: getByID,
            list: list,
            update: update,
            dlete: dlete,
            notDepartures: notDepartures
        };

        function create(data) {
            return urlbase.customPOST(data);
        }

        function getByID(id) {
            return urlbase.all(id).customGET();
        }

        function list(limit, offset, querySet) {
            if (limit !== undefined && offset !== undefined) {
                if (querySet === undefined) {
                    return API.all(URLS.management.base).all(URLS.management.inventory.base + '/' + URLS.management.inventory.cabinet + '?limit=' + limit + '&offset=' + offset).customGET();
                }
                else {
                    return API.all(URLS.management.base).all(URLS.management.inventory.base + '/' + URLS.management.inventory.cabinet + '?limit=' + limit + '&offset=' + offset + '&' + querySet).customGET();
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

        function notDepartures(data) {
            return API.all(URLS.management.base).all(URLS.management.inventory.base + '/' + URLS.management.inventory.impediment).customPOST(data);
        }
    }
})();
