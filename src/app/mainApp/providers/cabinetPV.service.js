(function() {
    'use strict';

    angular
        .module('app')
        .factory('cabinetPV', cabinetPV);

    /* @ngInject */
    function cabinetPV($q, MobileRestangular, URLS) {

        var urlbase = MobileRestangular.all(URLS.cabinet_pv);

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
        function list(limit, offset){
            if(limit.isDefined && offset.isDefined){
                return MobileRestangular.all(URLS.cabinet_pv+'?limit='+limit+'&offset='+offset).customGET();
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
