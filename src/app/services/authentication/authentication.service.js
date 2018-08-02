(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(OAuth, $q, WebRestangular, RoleStore, User) {

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

                            localStorage.setItem('roles', JSON.stringify(roles));

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
            return localStorage.getItem('token');
        }

        function logout() {
            RoleStore.clearStore();
            return OAuth.revokeToken();
        }

        function refreshToken() {
            var request = $q.defer();
            if (OAuth.canRefresh()) {
                console.log('Refreshing token');
                OAuth
                    .refreshToken()
                    .then(function () {
                        var roles = JSON.parse(localStorage.getItem('roles'));
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
