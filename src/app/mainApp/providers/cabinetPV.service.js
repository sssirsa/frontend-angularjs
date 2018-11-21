(function() {
    'use strict';

    angular
        .module('app')
        .factory('cabinetPV', cabinetPV);

    /* @ngInject */
    function cabinetPV(
        $q,
        API,
        URLS) {

        var urlbase = API.all(URLS.mobile.base).all(URLS.cabinet_pv);

        return {
            create: create,
            getByID:getByID,
            list: list,
            update: update,
            dlete: dlete
        };

        function create(data){
            return urlbase.customPOST(data);
        }

        function getByID(id) {
            return urlbase.all(id).customGET();
        }
        function list(limit, offset, querySet){
            if(limit !== undefined && offset !== undefined){
                if (querySet === undefined) {
                    return API.all(URLS.mobile.base).all(URLS.cabinet_pv+'?limit='+limit+'&offset='+offset).customGET();
                }
                else {
                    return API.all(URLS.mobile.base).all(URLS.cabinet_pv+'?limit='+limit+'&offset='+offset+'&'+querySet).customGET();
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
