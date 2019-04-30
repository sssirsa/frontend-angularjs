(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $state, AuthService, $urlRouter, RoleStore, $cookies) {

        // default redirect if access is denied
        function accessDenied() {
            $state.go('404');
            $urlRouter.sync();
            AuthService.logout();
        }

        $rootScope.$on('$destroy',function rootScopeDestroy() {
            locationChangeSuccess();
            stateChangePermissionDenied();
        });

        var locationChangeSuccess = $rootScope.$on('$locationChangeSuccess', function locationChangeSuccess(evt, new_url) {
            //Required for getting roles when page Update
            var roles_JSON = $cookies.getObject('roles');
            var roles;
            roles_JSON ? roles = roles_JSON : null;
            roles_JSON ? RoleStore.defineManyRoles(roles) : null;

            evt.preventDefault();
            if (
                !new_url.endsWith("#!") &&
                !new_url.endsWith("/") &&
                !new_url.endsWith("login") &&
                !new_url.endsWith("404") &&
                !new_url.endsWith("main")
            ) {
                if (!AuthService.isAuthenticated()) {
                    if (AuthService.canRefreshSession()) {
                        AuthService
                            .refreshToken()
                            .then(function () {
                                $urlRouter.sync();
                            })
                            .catch(function () {
                                accessDenied();
                            });
                    }
                    else {
                        accessDenied();
                    }
                }
                else {
                    $urlRouter.sync();
                }
            }
        });

        // redirect all denied permissions to 404
        var stateChangePermissionDenied = $rootScope.$on('$stateChangePermissionDenied', function stateChangePermissionDenied() {
            $state.go('404');
            $urlRouter.sync();
        });

    }
})();
