(function () {
    angular
        .module('app')
        .factory('OAuth', ['EnvironmentConfig', 'WebRestangular', 'MobileRestangular', '$q', '$cookies', 'RoleStore', 'User', OAuthProvider]);

    function OAuthProvider(EnvironmentConfig, WebRestangular, MobileRestangular, $q, $cookies, RoleStore, User) {
        return {
            getToken: getToken,
            refreshTokenFunction: refreshTokenFunction,
            isValidToken: isValidToken,
            revokeToken: revokeToken
        };

        function authenticate (params){
            var request = $q.defer();

            MobileRestangular.all('oauth').all('token/')
                .customPOST({'content-type': 'application/json'}, null, params)
                .then(function (loginResponse) {
                    $cookies.putObject('token', loginResponse.access_token);
                    $cookies.putObject('refreshToken', loginResponse.refresh_token);
                    var expiration = new Date();
                    expiration.setSeconds(expiration.getSeconds()+loginResponse.expires_in);
                    $cookies.putObject('expiration', expiration);
                    WebRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookies.getObject('token')});
                    MobileRestangular.setDefaultHeaders({Authorization: 'bearer ' + $cookies.getObject('token')});

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

        function getToken(userName, password) {
            RoleStore.clearStore();
            var data = {
                grant_type: 'password',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                username: userName,
                password: password
            };

            return authenticate(data);
        }

        function refreshTokenFunction() {
            var data = {
                grant_type: 'refresh_token',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                refresh_token: $cookies.getObject('refreshToken')
            };

            return authenticate(data);
        }

        function isValidToken() {
            if ($cookies.getObject('expiration')) {
                return !compareDates();
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
            var date_expiration = $cookies.getObject('expiration');
            var now = new Date();
            var expiration = new Date(date_expiration);
            return now > expiration;
        }

    }

})();
