(function(){
    angular
        .module('app.mainApp')
        .factory('SolicitudesPVProvider',solicitudesPVProvider);

    function solicitudesPVProvider(Restangular, EnvironmentConfig, URLS){
        var baseURL = null;

        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.mobile_dev).all('solicitud');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.mobile_stg).all('solicitud');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.mobile).all('solicitud');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.mobile_local).all('solicitud');
                break;
        }

        return {
            list:list,
            getByID:getByID,
            create:create,
            update:update,
            remove:remove
        };

        function list(){
            return baseURL.getList();
        }

        function getByID(id){
            return baseURL.customGET(id);
        }

        function create(object) {
            return baseURL.post(object);
        }

        function update(id, element){
            return baseURL.all(id).customPUT(element);
        }

        function remove(id){
            return baseURL.customDELETE(id,null,{'content-type':'application/json'});
        }

    }

})();
