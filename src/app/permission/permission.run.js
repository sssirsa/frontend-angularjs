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
            AuthService.logout();
        }

        $rootScope.$on('$stateChangePermissionStart', function(event, toState, toParams, options) {
            if(toState.name != "login" || toState.name != "404" || toState.name != "main") {
                if (AuthService.isAuthenticated()) {
                    var roles = $cookies.getObject('roles');
                    RoleStore.defineManyRoles(roles);
                }
                else {
                    console.debug('Access denied');
                    AuthService
                        .refreshToken()
                        .then(function () {
                            var roles = $cookies.getObject('roles');
                            RoleStore.defineManyRoles(roles);
                        })
                        .catch(function () {
                            deniedHandle();
                        });
                }
            }
        });

       // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        /*        $rootScope.$on('$destroy', function () {
                   deniedHandle();
               });*/


    }
})();
