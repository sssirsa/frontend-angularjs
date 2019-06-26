(function () {
    'use strict';

    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun(AuthService, $transitions, $state) {

        // default redirect if access is denied
        function accessDenied() {
            $state.go('404');
            AuthService.logout();
        }

        //$rootScope.$on('$destroy', function rootScopeDestroy() {
        //    locationChangeSuccess();
        //    stateChangePermissionDenied();
        //});

        $transitions.onCreate({}, function (transition) {
            if (transition.to().name !== 'splash'
                && transition.to().name !== 'login') {
                //Any other state that requires login
                if (!AuthService.isAuthenticated()) {
                    if (AuthService.canRefreshSession()) {
                        //return AuthService
                        //    .refreshToken();
                    }
                    else {
                        accessDenied();
                    }
                }
            }
        });

        //Transition aborted due to permissions validation
        $transitions.onError({}, function () {
            accessDenied();
        });

    }
})();
