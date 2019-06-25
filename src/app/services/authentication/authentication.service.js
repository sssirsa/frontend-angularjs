(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(
        OAuth,
        $q,
        URLS,
        API,
        PermRoleStore,
        User,
        $cookies,
        Person
    ) {

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
            PermRoleStore.clearStore();
            var request = $q.defer();
            OAuth
                .getToken(credentials.username, credentials.password)
                .then(function () {
                    PermRoleStore.defineRole('AUTHENTICATED', []);

                    Person.getMyProfile()
                        .then(function requestGetMyProfile(user) {
                            request.resolve();
                            User.setUser(user);
                        })
                        .catch(function (errorUser) {
                            request.reject(errorUser);
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
            PermRoleStore.clearStore();
            return OAuth.revokeToken();
        }

        function refreshToken() {
            PermRoleStore.clearStore();
            var request = $q.defer();
            if (OAuth.canRefresh()) {
                OAuth
                    .refreshToken()
                    .then(function () {
                        PermRoleStore.defineRole('AUTHENTICATED', []);

                        Person.getMyProfile()
                            .then(function requestGetMyProfile(user) {
                                request.resolve();
                                User.setUser(user);
                            })
                            .catch(function (errorUser) {
                                request.reject(errorUser);
                            });
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
