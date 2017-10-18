(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .factory('AuthService', AuthService);
    /* @ngInject */
    function AuthService(Session, $q, Restangular, PusherClient, Channel, OAuth, EVENTS_GENERAL, $rootScope,
                         Notification, AUTH_EVENTS, OAuthToken, EnvironmentConfig, URLS) {

        var authService = {
            isAuthenticated: isAuthenticated,
            login: login,
            isAuthorized: isAuthorized,
            logout: logout,
            getUser: getUser,
            isIdentityResolved: isIdentityResolved,
            refreshToken: refreshToken,
            getToken: getToken,
            revokeToken: revokeToken
        };

        function getToken() {
            var deferred = $q.defer();
            if (isAuthenticated()) {
                deferred.resolve(OAuthToken.getAccessToken());
            } else {
                this.refreshToken().then(function (data) {
                    deferred.resolve();
                });
            }
            return deferred.promise;
        }

        function revokeToken() {
            OAuth.revokeToken();
        }

        function refreshToken() {
            return OAuth.getRefreshToken();
        }

        function getPersona() {
            var baseUrl = null;
            switch (EnvironmentConfig.environment) {
                case 'development':
                    baseUrl = Restangular.all(URLS.environment.genesis_dev).all('persona');
                    break;
                case 'staging':
                    baseUrl = Restangular.all(URLS.environment.genesis_stg).all('persona');
                    break;
                case 'production':
                    baseUrl = Restangular.all(URLS.environment.genesis).all('persona');
                    break;
                case 'local':
                    baseUrl = Restangular.all(URLS.environment.genesis_local).all('persona');
                    break;
            }
            return baseUrl.customGET();
        }

        function isIdentityResolved() {
            return angular.isDefined(Session.userInformation);
        }

        function getRole() {
            var baseUrl = null;
            switch (EnvironmentConfig.environment) {
                case 'development':
                    baseUrl = Restangular.all(URLS.environment.genesis_dev).all('my_groups');
                    break;
                case 'staging':
                    baseUrl = Restangular.all(URLS.environment.genesis_stg).all('my_groups');
                    break;
                case 'production':
                    baseUrl = Restangular.all(URLS.environment.genesis).all('my_groups');
                    break;
                case 'local':
                    baseUrl = Restangular.all(URLS.environment.genesis_local).all('my_groups');
                    break;
            }
            return baseUrl.getList();
        }

        function login(credentials) {
            var deferred = $q.defer();

            OAuth.getAccessToken(credentials).then(function (res) {
                PusherClient.create();
                deferred.resolve();
            }).catch(function (response) {
                if (response.status == 401) {
                    return deferred.reject(response.data);
                }
                return deferred.reject({
                    error: response.data
                });
            });
            return deferred.promise;
        }

        function isAuthenticated() {
            return OAuth.isAuthenticated();
        }

        function isAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
        }

        function logout() {
            var deferred = $q.defer();
            OAuth.revokeToken().then(function () {
                //Notification.unsubscribePresenceChannel(Session.userInformation.id.toString());
                //Notification.unsubscribePresenceChannel('administrador');

                Session.destroy();
                //PusherClient.destroy();
                Channel.clear();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

                deferred.resolve();

            }).catch(function (response) {

            });

            return deferred.promise;
        }

        function getUser() {
            var user = {};
            var deferred = $q.defer();
            getPersona().then(function (res) {
                user.userInformation = res;
                getRole().then(function (res) {
                    Session.create(user.userInformation, res[0].name);
                    if (angular.isArray(res) && res[0].name === 'Administrador') {
                        if (Channel.all().length == 0) {
                            if (angular.isUndefined(PusherClient.pusher)) {
                                PusherClient.create();
                            }
                            Channel.add(Notification.subscribePresenceChannel('administrador'));
                            Channel.add(Notification.subscribePresenceChannel(Session.userInformation.id.toString()));
                            $rootScope.$broadcast(EVENTS_GENERAL.bind_channels);

                        }
                    }
                    $rootScope.$broadcast(AUTH_EVENTS.sessionRestore);
                    deferred.resolve(res[0].name);

                }).catch(function (res) {
                    console.log(res);
                });
            }).catch(function (res) {
                console.log(res);
            });
            return deferred.promise;
        }


        return authService;
    }
})();
