(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun(
        AuthService,
        $transitions,
        $state,
        PERMISSION
    ) {

        //Redirect if access is denied
        function accessDenied() {
            $state.go('404');
            AuthService.logout();
        }

        $transitions.onCreate({}, function (transition) {
            if (transition.to().name !== 'splash'
                && transition.to().name !== '404'
                && transition.to().name !== 'login') {
                //Any other state that requires login
                if (!AuthService.isAuthenticated()) {
                    //User not athenticated
                    if (AuthService.canRefreshSession()) {
                        //Permission redefining is managed in AuthService.refreshToken function
                        AuthService
                            .refreshToken()
                            .then(function () {
                                return true;
                            })
                            .catch(function () {
                                return false;
                            });
                    }
                    else {
                        accessDenied();
                    }
                }
                else {
                    //User is authenticated
                    if (!transition.from().name) {
                        //Just define role and permissions if page has been updated
                        PERMISSION.setPermissions(PERMISSION.getPermissions());
                    }
                    return true;
                }
            }
        });

        //Transition aborted due to permissions validation
        $transitions.onError({}, function () {
            accessDenied();
        });

    }
})();
