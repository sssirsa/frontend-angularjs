(function () {
    angular
        .module('app.mainApp')
        .factory('Routes', Routes);

    function Routes(Restangular, EnvironmentConfig, URLS) {
        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.mobile_dev).all('report_builder/api');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.mobile_stg).all('report_builder/api');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.mobile).all('report_builder/api');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.mobile_local).all('report_builder/api');
                break;
        }
    }

    return {
        list: list,
        getByID: getByID,
        create: create,
        remove: remove,
        update: update
    }

    function list() {
        return baseURL.all('ruta').getList();
    }

    function getByID(id) {
        return baseURL.one('ruta', id).customGET();
    }

    function create(object) {
        return baseURL.all('ruta').customPOST(object);
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

})();
