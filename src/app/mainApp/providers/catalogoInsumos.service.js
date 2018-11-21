/**
 * Created by franciscojaviercerdamartinez on 11/09/16.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('CatalogoInsumo', CatalogoInsumo);

    /* @ngInject */
    function CatalogoInsumo(
        $q,
        API,
        URLS
    ) {
        var baseCatalogoInsumo = API.all(URLS.genesis.base).all(URLS.catalogo_insumos);

        return {

            getAllCatalogoInsumos:getAllCatalogoInsumos,
            getCatalogoInsumo:getCatalogoInsumo,
            getCatalogoByZone:getCatalogoByZone,
            getCatalogoByWord:getCatalogoByWord,
            list:list,
            listObject:listObject,
            update:update,
            create:create,
            remove:remove
        };


        function getCatalogoInsumo(catalogo) {
            var deferred = $q.defer();
            API.all(URLS.genesis.base).one(URLS.catalogo_insumos, catalogo).customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }


        function getCatalogoByZone(etapa) {
            var deferred = $q.defer();

            API.all(URLS.genesis.base).all(URLS.catalogo_insumos).one('zone', etapa).customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getCatalogoByWord(word) {
            var deferred = $q.defer();
            API.all(URLS.genesis.base).all(URLS.catalogo_insumos).one('lookup',word).customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(res);
            });
            return deferred.promise;
        }

        function getAllCatalogoInsumos() {
            var deferred = $q.defer();
            API.all(URLS.genesis.base).all(URLS.catalogo_insumos).customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(res);
            });
            return deferred.promise;
        }

        function list(){
            return baseCatalogoInsumo.getList().$object;
        }
        function listObject() {
            return baseCatalogoInsumo.getList();
        }

        function update(object)
        {
            return baseCatalogoInsumo.all(object.id).customPUT(object);
        }

        function create(object){
            return baseCatalogoInsumo.post(object);
        }

        function remove(object) {
            return baseCatalogoInsumo.customDELETE(object.id,null,{'content-type':'application/json'});
        }
    }
})();
