(function(){
    angular
        .module('app')
        .factory('WebRestangular', WebRestangular);

    function WebRestangular(Restangular, EnvironmentConfig) {
        return Restangular.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.setBaseUrl(EnvironmentConfig.site.rest.web_api);
        });
    }

})();
