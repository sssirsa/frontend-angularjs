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
        Person,
        PERMISSION
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
                .then(function (response) {
                    console.log(response);
                    Person.getMyProfile(response.person)
                        .then(function requestGetMyProfile(user) {
                            PERMISSION.definePermissions(user['permissions']);
                            User.setUser(user);
                            request.resolve();
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
            User.clearUser();
            localStorage.removeItem('permissions');
            $cookies.remove('user');
            return OAuth.revokeToken();
        }

        function refreshToken() {
            PermRoleStore.clearStore();
            var request = $q.defer();
            if (OAuth.canRefresh()) {
                OAuth
                    .refreshToken()
                    .then(function () {
                        Person.getMyProfile()
                            .then(function requestGetMyProfile(user) {
                                User.setUser(user);
                                PERMISSION.definePermissions(user['permissions']);
                                request.resolve();
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
