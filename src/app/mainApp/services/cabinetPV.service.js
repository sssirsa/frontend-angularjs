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
            list: list
        };

        function create(data){
            return urlbase.customPOST(data);
        }

        function list(){
            return urlbase.getList();
        }
    }
})();
