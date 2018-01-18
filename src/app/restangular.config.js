/**
 * Created by Emmanuel on 17/07/2016.
 */
(function(){
    angular
        .module('app')
        .config(config);

    function config(RestangularProvider, EnvironmentConfig, $httpProvider) {
        var baseUrl = EnvironmentConfig.site.rest['web-api'];

        RestangularProvider.setBaseUrl(baseUrl);
        $httpProvider.interceptors.push('AuthInterceptor');

    }
})();
