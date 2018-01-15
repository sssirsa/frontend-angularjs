/**
 * Created by Emmanuel on 16/10/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp.reportes')
        .factory('ReportList',Reportes);

    function Reportes(Restangular, EnvironmentConfig){
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(EnvironmentConfig.site.rest.api_reports);
        });
    }
})();
