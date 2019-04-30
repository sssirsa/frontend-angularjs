/**
 * Created by Sandra Ivette on 6/2/16.
 */
(function () {
    angular
        .module('app.mainApp.management.profile')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('app/mainApp/management/profile');
        $stateProvider
            .state('triangular.admin-default.profile',{
                url:'/profile',
                templateUrl:'app/mainApp/management/profile/profileUser.html',
                controller:'ProfileController',
                controllerAs:'vm'
            });


    }



})();
