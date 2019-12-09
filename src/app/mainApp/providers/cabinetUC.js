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
            notDepartures: notDepartures,
            getCabinetInSubsidiary: getCabinetInSubsidiary,
            getImpediment: getImpediment,
            obsolete: obsolete
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

        function getCabinetInSubsidiary(id) {
            return API.all(URLS.management.base).all(URLS.management.control.base + '/' + URLS.management.control.cabinet_in_subsidiary).all(id).customGET();
        }

        function getImpediment(id) {
            return API.all(URLS.management.base).all(URLS.management.inventory.base + '/' + URLS.management.inventory.impediment).all(id).customGET();
        }

        function obsolete(data) {
            return API.all(URLS.management.base).all(URLS.management.inventory.base + '/' + URLS.management.inventory.obsolete).customPOST(data);
        }

    }
})();
