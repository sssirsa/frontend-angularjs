(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(OAuth, $q, WebRestangular, RoleStore, User, $cookies) {

        var authService = {
            canRefreshSession: canRefreshSession,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            getToken: getToken,
            refreshToken: refreshToken
        };

        function canRefreshSession() {
            return OAuth.canRefresh();
        }

        function isAuthenticated() {
            return OAuth.isValidToken();
        }

        function login(credentials) {
            RoleStore.clearStore();
            var request = $q.defer();
            OAuth
                .getToken(credentials.username, credentials.password)
                .then(function () {
                    WebRestangular.all('my_groups')
                        .customGET()
                        .then(function (profile) {
                            var roles = {};

                            angular.forEach(profile, function (roleName) {
                                roles[roleName.name.toUpperCase()] = [];
                            });

                            $cookies.putObject('roles', roles);

                            RoleStore.defineManyRoles(roles);

                            WebRestangular.all('persona')
                                .customGET()
                                .then(function (user) {
                                    request.resolve();
                                    User.setUser(user);
                                })
                                .catch(function (errorUser) {
                                    request.reject(errorUser);
                                });

                        })
                        .catch(function (profileError) {
                            request.reject(profileError);
                        });
                })
                .catch(function (error) {
                    request.reject(error);
                });

            return request.promise;
        }

        function getToken() {
            return $cookies.getObject('token');
        }

        function logout() {
            RoleStore.clearStore();
            return OAuth.revokeToken();
        }

        function refreshToken() {
            var request = $q.defer();
            if (OAuth.canRefresh()) {
                OAuth
                    .refreshToken()
                    .then(function () {
                        var roles = $cookies.getObject('roles');
                        RoleStore.defineManyRoles(roles);
                        request.resolve();
                    })
                    .catch(function (errorRefreshToken) {
                        request.reject(errorRefreshToken);
                    });
            }
            else {
                request.reject();
            }
            return request.promise;
        }

        return authService;
    }
})();
