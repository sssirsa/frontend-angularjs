(function(){
    angular
        .module('app')
        .factory('MobileRestangular', MobileRestangular);

    function MobileRestangular(Restangular, EnvironmentConfig) {
        return Restangular.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.setBaseUrl(EnvironmentConfig.site.rest.mobile_api);
        });
    }

})();
