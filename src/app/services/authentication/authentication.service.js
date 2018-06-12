(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(OAuth, $cookies, $q) {

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
            var request = $q.defer();
            if(OAuth.canRefresh()) {
                OAuth
                    .refreshToken()
                    .then(function(){
                        request.resolve();
                    })
                    .catch(function(errorRefreshToken){
                        request.reject(errorRefreshToken);
                    });
            }
            else{
                request.reject();
            }
            return request.promise;
        }

        return authService;
    }
})();
