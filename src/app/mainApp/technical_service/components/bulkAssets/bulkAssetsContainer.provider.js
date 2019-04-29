/**
 * Created by franciscojaviercerdamartinez on 2/11/19.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('bulkAssetsProvider', bulkAssetsProvider);

    /* @ngInject */
    function bulkAssetsProvider($q,
                                       URLS,
                                       API) {

        var urlbase = API.all(URLS.inventory.base)
            .all(URLS.technical_service.bulk_assets.asset);

        return {

            getByStage:getByStage

        };


        function getByStage(tipoEquipo, catalogoEtapa) {
            return urlbase.all(URLS.technical_service.bulk_assets.bulksByStep+'?tipo_equipo__id='+tipoEquipo+'&catalogo_etapa__nombre='+catalogoEtapa).customGET();
        }



    }
})();
