(function () {
    angular
        .module('app.mainApp')
        .factory('Stores', Stores);

    function Stores(Restangular, EnvironmentConfig, URLS) {
        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.mobile_dev).all('establecimiento');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.mobile_stg).all('establecimiento');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.mobile).all('establecimiento');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.mobile_local).all('establecimiento');
                break;
        }


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

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update
        };

    }

})();
