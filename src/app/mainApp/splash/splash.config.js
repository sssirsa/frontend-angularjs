(function(){
    angular
        .module('app.mainApp.splash')
        .config(splashModuleConfig);

    function splashModuleConfig($stateProvider){
        $stateProvider
            .state('splash', {
                url:'/main',
                templateUrl:'app/mainApp/splash/splash.html',
                controller:'splashController',
                controllerAs:'vm'
            });
    }

})();
