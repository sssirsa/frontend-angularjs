(function () {
    angular
        .module('app.mainApp')
        .factory('Stores', Stores);

    function Stores(MobileRestangular, URLS, QUERIES, Helper, $q) {
        var baseURL = MobileRestangular.all(URLS.establecimiento);

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

        function getByLocality(LocalityID){
            return querySearch(URLS.establecimiento + QUERIES.store.by_locality + LocalityID);
        }

        function getByCity(cityID){
            return querySearch(URLS.establecimiento + QUERIES.store.by_city + cityID);
        }

        function getByState(stateID){
            return querySearch(URLS.establecimiento + QUERIES.store.by_state + stateID);
        }

        function getByPostalCode(postalCode){
            return querySearch(URLS.establecimiento + QUERIES.store.by_postal_code + postalCode);
        }

        function getByEconomic(economic){
            return querySearch(URLS.establecimiento + QUERIES.store.by_economic + economic);
        }

        function querySearch(query){
            var defer = $q.defer();

            MobileRestangular.all(query)
                .getList()
                .then(function (list) {
                    var elements = Helper.filterDeleted(list,true);
                    defer.resolve(elements);
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
            getByLocality: getByLocality,
            getByCity: getByCity,
            getByState:getByState,
            getByPostalCode:getByPostalCode,
            getByEconomic:getByEconomic,
            getPDF:getPDF
        };

    }

})();
