(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService(Session, $q, WebRestangular, /*PusherClient,*/ Channel, OAuth, EVENTS_GENERAL, $rootScope,
                         Notification, AUTH_EVENTS, OAuthToken, URLS, $cookies) {

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
            return OAuth.getAccessToken(credentials.username, credentials.password);
        }

        function getToken() {
            return $cookies.get('token');
        }

        function logout() {
            return OAuth.revokeToken();
        }

        /*function getUser() {
            var user = {};
            var deferred = $q.defer();
            getPersona().then(function (res) {
                user.userInformation = res;
                getRole().then(function (res) {
                    Session.create(user.userInformation, res[0].name);

                    if (angular.isArray(res) && res[0].name === 'Administrador') {
                        if (Channel.all().length == 0) {
                            /!*if (angular.isUndefined(PusherClient.pusher)) {
                                //PusherClient.create();
                            }*!/
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
        }*/

        return authService;
    }
})();
