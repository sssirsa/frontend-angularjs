(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(OAuth, $cookies) {

        var authService = {
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            getToken: getToken,
            refreshToken: refreshToken
        };

        function isAuthenticated() {
            return OAuth.isValidToken();
        }

        function login(credentials) {
            return OAuth.getToken(credentials.username, credentials.password);
        }

        function getToken() {
            return $cookies.getObject('token');
        }

        function logout() {
            return OAuth.revokeToken();
        }

        function refreshToken(){
            return OAuth.refreshTokenFunction();
        }

        return authService;
    }
})();
