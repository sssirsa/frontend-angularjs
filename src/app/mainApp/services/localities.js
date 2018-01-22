(function () {
    angular
        .module('app.mainApp')
        .factory('Localities', Localities);

    function Localities(MobileRestangular, URLS, $q, Helper) {
        var baseURL = MobileRestangular.all(URLS.localidad);

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

        function getByCity(cityID){
            var defer = $q.defer();

            list()
                .then(function (localitiesList) {
                    var localities = Helper.filterDeleted(localitiesList.filter(function (locality) {
                        return locality.estado.municipio.id === cityID;
                    }),true);
                    defer.resolve(localities);
                })
                .catch(function (localitiesListError) {
                    defer.reject(localitiesListError);
                });

            return defer.promise;
        }

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update,
            getByCity: getByCity
        };
    }

})();
