(function () {
    angular
        .module('app')
        .factory('API', ApiRestangular);

    function ApiRestangular(
        Restangular,
        EnvironmentConfig) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(EnvironmentConfig.site.rest.api);
        });
    }

})();
