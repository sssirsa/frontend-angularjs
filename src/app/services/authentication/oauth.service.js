(function () {
    angular
        .module('app')
        .factory('OAuth', ['EnvironmentConfig', 'WebRestangular', 'MobileRestangular', '$q', '$cookieStore', 'RoleStore', 'User', OAuthProvider]);

    function OAuthProvider(EnvironmentConfig, WebRestangular, MobileRestangular, $q, $cookieStore, RoleStore, User) {
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
                    $cookieStore.put('token', loginResponse.access_token);
                    $cookieStore.put('refreshToken', loginResponse.refreshToken);
                    var now = moment((moment().format('MMM D YYYY H:m:s A')), 'MMM D YYYY H:m:s A');
                    var expiration = now.add(loginResponse.expires_in, 'seconds');
                    $cookieStore.put('expiration', expiration);
                    WebRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookieStore.get('token')});
                    MobileRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookieStore.get('token')});

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
                refresh_token: $cookieStore.get('refreshToken')
            };
            return MobileRestangular.all('oauth').all('token')
                .customPOST({'content-type': 'application/json'}, null, data);

        }

        function isValidToken() {
            if ($cookieStore.get('expiration') !== null) {
                if (compareDates()) {
                    $cookieStore.remove('token');
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        }

        function revokeToken(){
            $cookieStore.remove('token');
            $cookieStore.remove('refresh_token');
            $cookieStore.remove('expiration');
        }

        function compareDates() {
            var date_expiration = $cookieStore.get('expiration');
            moment.locale('en');
            var now = moment((moment().format('MMM D YYYY H:m:s A')), 'MMM D YYYY H:m:s A');
            var expiration = moment(date_expiration, 'MMM D YYYY H:m:s A');
            return now > expiration;
        }

    }

})();
