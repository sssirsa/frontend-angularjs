(function () {
    angular
        .module('app')
        .factory('OAuth', ['EnvironmentConfig', 'Restangular', '$q', '$cookieStore', 'RoleStore', 'URLS', OAuthProvider]);

    function OAuthProvider(EnvironmentConfig, Restangular, $q, $cookieStore, RoleStore, URLS) {
        return {
            getToken: getToken,
            refreshToken: refreshToken,
            isValidToken:isValidToken
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

            Restangular.all('oauth').all('token').customPOST({'content-type': 'application/json'}, null, data)
                .then(function (loginResponse) {
                    $cookieStore.put('token', loginResponse.value);
                    $cookieStore.put('refreshToken', loginResponse.refreshToken.value);
                    $cookieStore.put('expiration', loginResponse.expiration);
                    Restangular.setDefaultHeaders({authorization: 'bearer ' + $cookieStore.get('token')});

                    Restangular.all(URLS.PROFILE).all('profile').customGET()
                        .then(function(profile){
                            var roles = {};

                            angular.forEach(profile.authorities,function(roleName){
                                roles[roleName.name.toUpperCase()]=[];
                            });

                            RoleStore.defineManyRoles(roles);
                            console.log(RoleStore.getStore());

                            request.resolve();
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
            return Restangular.all('oauth').all('token').customPOST({'content-type': 'application/json'}, null, data);

        }

        function isValidToken(){
            if ($cookieStore.get('expiration')!== null){
                if (compareDates()){
                    $cookieStore.remove('token');
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        }

        function compareDates() {
            var date_expiration=$cookieStore.get('expiration');
            moment.locale('en');
            var now=moment((moment().format('MMM D YYYY H:m:s A')),'MMM D YYYY H:m:s A');
            var expiration=moment(date_expiration,'MMM D YYYY H:m:s A');
            return now > expiration;
        }

    }

})();
