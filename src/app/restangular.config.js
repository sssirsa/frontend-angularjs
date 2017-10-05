/**
 * Created by Emmanuel on 17/07/2016.
 */
(function(){
    angular
        .module('app')
        .config(config);

    function config(RestangularProvider, EnvironmentConfig, $httpProvider) {
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                //EnvironmentConfig.site.rest.api+'mobile-dev/oauth/'
                baseUrl = EnvironmentConfig.site.rest.api;
                break;
            case 'staging':
                baseUrl = EnvironmentConfig.site.rest.api;
                break;
            case 'production':
                baseUrl = EnvironmentConfig.site.rest.api;
                break;
            case 'local':
                baseUrl = EnvironmentConfig.site.rest.api;
                break;
        }

        RestangularProvider.setBaseUrl(baseUrl);
        $httpProvider.interceptors.push('AuthInterceptor');
        //RestangularProvider.setDefaultHeaders({'Content-Type': "Application/JSON"});
        //RestangularProvider.setExtraFields(['name']);


    }
})();
