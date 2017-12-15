/**
 * Created by Emmanuel on 17/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Tecnico',Tecnico);

    function Tecnico(Restangular, EnvironmentConfig, URLS){
        var urlbase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                urlbase = Restangular.all(URLS.environment.genesis_dev).all('my_groups');
                break;
            case 'staging':
                urlbase = Restangular.all(URLS.environment.genesis_stg).all('my_groups');
                break;
            case 'production':
                urlbase = Restangular.all(URLS.environment.genesis).all('my_groups');
                break;
            case 'local':
                urlbase = Restangular.all(URLS.environment.genesis_local).all('my_groups');
                break;
        }

        return{
            getRole:getRole
        };

        function getRole(){
            return urlbase.customGET().then(function(res){
                return res;
            }).catch(function(err){
                console.log(err);
            });
        }
    }
})();
