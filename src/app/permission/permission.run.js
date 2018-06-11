(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $state, AuthService, RoleStore, $cookies) {

        // default redirect if access is denied
        function accessDenied() {
            $state.go('404');
        }

        $rootScope.$on('$stateChangePermissionStart', function(event, toState, toParams, options) {
            if(AuthService.isAuthenticated()) {
                var roles = $cookies.getObject('roles');
                RoleStore.defineManyRoles(roles);
            }
            else{
                accessDenied();
            }
        });

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function () {
            deniedHandle();
        });


    }
})();
