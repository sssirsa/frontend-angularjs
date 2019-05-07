/**
 * Created by Emmanuel on 02/06/2016.
 */
(function () {
    angular
        .module('app.mainApp.management.login')
        .config(moduleConfig);

    function moduleConfig($stateProvider){
        $stateProvider
            .state('login',{
                url:'/login',
                templateUrl:'app/mainApp/management/login/login.tmpl.html',
                controller:'LoginController',
                controllerAs:'vm'

            });

    }

})();
