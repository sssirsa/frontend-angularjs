/**
 * Created by Christian on 11/09/2016.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('Sucursal', Sucursal);

    function Sucursal(
        API,
        URLS,
        EnvironmentConfig
    ) {
        var baseURL = EnvironmentConfig.site.rest.api
            + '/' + URLS.management.base
            + '/'
            + URLS.management.catalogues.base
            + '/' + URLS.management.catalogues.subsidiary;

        var baseSucursal = API.all(baseURL);
        return {
            list: list,
            update: update,
            create: create,
            remove: remove,
            listObject: listObject,
            getByID: getByID
        };

        function listObject(limit, offset) {
            return API.all(URLS.genesis.base).all(URLS.sucursal+'?limit='+limit+'&offset='+offset).customGET();
        }

        function list() {
            return baseSucursal.getList().$object;
        }

        function update(object) {
            return baseSucursal.all(object.id).customPUT(object);
        }

        function create(object) {
            return baseSucursal.post(object);
        }

        function remove(object) {
            return baseSucursal.customDELETE(object.id, null, {'content-type': 'application/json'});
        }

        function getByID(id) {
            return baseSucursal.all(id).customGET();
        }
    }

})();
