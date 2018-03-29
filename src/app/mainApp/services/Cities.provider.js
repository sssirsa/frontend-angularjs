(function () {
    angular
        .module('app.mainApp')
        .factory('Cities', Cities);

    function Cities(MobileRestangular, URLS, $q, Helper, QUERIES) {
        var baseURL = MobileRestangular.all(URLS.municipio);

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

        function getByState(stateID) {
            var defer = $q.defer();

            MobileRestangular.all(URLS.municipio + QUERIES.city.by_state + stateID)
                .then(function (citiesList) {
                    var cities = Helper.filterDeleted(citiesList,true);
                    defer.resolve(cities);
                })
                .catch(function (citiesListError) {
                    defer.reject(citiesListError);
                });


            return defer.promise;
        }

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update,
            getByState: getByState
        };

    }

})();
