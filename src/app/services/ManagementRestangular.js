(function(){
    angular
        .module('app')
        .factory('ManagementRestangular', ManagementRestangular);

    function ManagementRestangular(Restangular, EnvironmentConfig) {
        return Restangular.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.setBaseUrl(EnvironmentConfig.site.rest.management_api);
        });
    }

})();
