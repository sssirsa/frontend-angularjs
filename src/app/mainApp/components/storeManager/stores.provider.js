(function () {
    angular
        .module('app.mainApp')
        .factory('Stores', Stores);

    function Stores(
        API,
        URLS,
        QUERIES,
        Helper,
        $q
    ) {
        var baseURL = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.catalogues.base)
            .all(URLS.salepoint.catalogues.stores);

        function list() {
            return baseURL.getList();
        }

        function getByID(id) {
            return baseURL.all(id).customGET();
        }

        function create(object) {
            return baseURL.customPOST(object);
        }

        function remove(id) {
            return baseURL.customDELETE(id, null, {'content-type': 'application/json'});
        }

        function update(object, id) {
            if (id) {
                return baseURL.all(id).customPUT(object);
            }
            else {
                return baseURL.all(object.id).customPUT(object);
            }
        }

        function getByEconomic(economic, limit, offset){
            return querySearch(QUERIES.store.by_economic + economic + '?', limit, offset);
        }

        function querySearch(query, limit, offset){
            var defer = $q.defer();
            // TODO: falta agregar metodo de paginado
            API
                .all(URLS.salepoint.base)
                .all(URLS.salepoint.catalogues.base)
                .all(URLS.salepoint.catalogues.stores + query + '&limit=' + limit + '&offset=' + offset)
                .customGET()
                .then(function (list) {
                    defer.resolve(list);
                })
                .catch(function (listError) {
                    defer.reject(listError);
                });

            return defer.promise;
        }

        function getPDF(id_establecimiento) {
            return baseURL.all(URLS.credentials).all(id_establecimiento).customGET();
        }

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update,
            getByEconomic:getByEconomic,
            getPDF:getPDF
        };

    }

})();
