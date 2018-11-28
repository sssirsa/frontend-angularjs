/**
 * Created by franciscojaviercerdamartinez on 11/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Insumo', Insumo);

    /* @ngInject */
    function Insumo(
        API,
        URLS
    ) {
        var path = API.all(URLS.genesis.base).all(URLS.insumo);

        return {

            getInsumosByCatalogo: getInsumosByCatalogo,
            getUsedInsumos: getUsedInsumos,
            getNoUsedInsumos: getNotUsedInsumos,
            getAllInsumos: getAllInsumos,
            create:create
        };

        function getInsumosByCatalogo(catalogo) {
            return path.one('catalog', catalogo).customGET();
        }

        function getUsedInsumos() {
            return path.all('used').customGET();
        }

        function getNotUsedInsumos() {
            return path.all('used').customGET();
        }

        function getAllInsumos() {
            return path.customGET();
        }

        function create(object){
            return path.post(object);
        }

    }
})();
