(function () {
    angular
        .module('app')
        .factory('OAuth', ['EnvironmentConfig', 'WebRestangular', 'MobileRestangular', '$q', '$cookies', 'RoleStore', 'User', OAuthProvider]);

    function OAuthProvider(EnvironmentConfig, WebRestangular, MobileRestangular, $q, $cookies, RoleStore, User) {
        return {
            getToken: getToken,
            refreshToken: refreshToken,
            isValidToken: isValidToken,
            revokeToken: revokeToken
        };

        function getToken(userName, password) {
            RoleStore.clearStore();
            var data = {
                grant_type: 'password',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                username: userName,
                password: password
            };

            var request = $q.defer();

            MobileRestangular.all('oauth').all('token/')
                .customPOST({'content-type': 'application/json'}, null, data)
                .then(function (loginResponse) {
                    $cookies.put('token', loginResponse.access_token);
                    $cookies.put('refreshToken', loginResponse.refreshToken);
                    var now = moment((moment().format('MMM D YYYY H:m:s A')), 'MMM D YYYY H:m:s A');
                    var expiration = now.add(loginResponse.expires_in, 'seconds');
                    $cookies.put('expiration', expiration);
                    WebRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookies.get('token')});
                    MobileRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookies.get('token')});

                    WebRestangular.all('my_groups')
                        .customGET()
                        .then(function (profile) {
                            var roles = {};

                            angular.forEach(profile, function (roleName) {
                                roles[roleName.name.toUpperCase()] = [];
                            });

                            RoleStore.defineManyRoles(roles);

                            WebRestangular.all('persona')
                                .customGET()
                                .then(function(user){
                                    request.resolve();
                                    User.setUser(user);
                                })
                                .catch(function(errorUser){
                                    request.reject(errorUser);
                                });

                        })
                        .catch(function(profileError){
                            request.reject(profileError);
                        });


                })
                .catch(function (errorLogin) {
                    request.reject(errorLogin);
                });

            return request.promise;
        }

        function refreshToken() {
            var data = {
                grant_type: 'refresh_token',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                refresh_token: $cookies.get('refreshToken')
            };
            return WebRestangular.all('oauth').all('token')
                .customPOST({'content-type': 'application/json'}, null, data);

        }

        function isValidToken() {
            if ($cookies.get('expiration') !== null) {
                if (compareDates()) {
                    $cookies.remove('token');
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        }

        function revokeToken(){
            $cookies.remove('token');
            $cookies.remove('refresh_token');
            $cookies.remove('expiration');
        }

        function compareDates() {
            var date_expiration = $cookies.get('expiration');
            moment.locale('en');
            var now = moment((moment().format('MMM D YYYY H:m:s A')), 'MMM D YYYY H:m:s A');
            var expiration = moment(date_expiration, 'MMM D YYYY H:m:s A');
            return now > expiration;
        }

    }

})();
