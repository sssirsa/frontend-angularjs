/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function(){
    'use_strict';//

    angular.module('app.mainApp').factory('groups',groups);
    function groups(Restangular){
        var urlbase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                urlbase = Restangular.all(URLS.environment.genesis_dev).all('groups');
                break;
            case 'staging':
                urlbase = Restangular.all(URLS.environment.genesis_stg).all('groups');
                break;
            case 'production':
                urlbase = Restangular.all(URLS.environment.genesis).all('groups');
                break;
            case 'local':
                urlbase = Restangular.all(URLS.environment.genesis_local).all('groups');
                break;
        }

        return {
            list:list
        };
        function list(){
            return urlbase.customGET();//prueba
        }
    }
})();
