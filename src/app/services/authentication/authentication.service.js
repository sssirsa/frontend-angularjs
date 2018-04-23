(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(OAuth, $cookieStore) {

        var authService = {
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            getToken: getToken
        };

        function isAuthenticated() {
            return OAuth.isValidToken();
        }

        function login(credentials) {
            return OAuth.getToken(credentials.username, credentials.password);
        }

        function getToken() {
            return $cookieStore.get('token');
        }

        function logout() {
            return OAuth.revokeToken();
        }

        return authService;
    }
})();
