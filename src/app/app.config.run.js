/**
 * Created by Emmanuel on 15/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .run(Run);
    function Run(
        amMoment
    ) {
        amMoment.changeLocale('es');
        /*$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            if (!AuthService.isAuthenticated()) {
                AuthService.logout();
            }
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

            /!*if (toState.name != 'login') {
                if (AuthService.isAuthenticated()) {
                    //AuthService. getUser();
                }
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

            } else {
                if (AuthService.isAuthenticated()) {
                    AuthService.logout();
                }
            }*!/
        });*/
        /*$rootScope.$on('oauth:error', function (event, rejection) {
            if ('invalid_grant' === rejection.data.error) {
                return;
            }

            // Refresh token when a `invalid_token` error occurs.
            if ('invalid_token' === rejection.data.error) {
                return OAuth.getRefreshToken();
            }
            return $window.location.href = '/login';
        });*/

    }
})();
