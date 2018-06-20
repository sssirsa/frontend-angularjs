(function () {
    angular
        .module('app')
        .factory('OAuth', ['EnvironmentConfig', 'WebRestangular', 'MobileRestangular', '$q', 'RoleStore', 'User', OAuthProvider]);

    function OAuthProvider(EnvironmentConfig, WebRestangular, MobileRestangular, $q) {
        return {
            getToken: getToken,
            refreshToken: refreshToken,
            isValidToken: isValidToken,
            canRefresh: canRefresh,
            revokeToken: revokeToken
        };

        function authenticate(params) {
            var request = $q.defer();

            MobileRestangular.all('oauth').all('token/')
                .customPOST({'content-type': 'application/json'}, null, params)
                .then(function (loginResponse) {
                    localStorage.setItem('token', loginResponse.access_token);
                    localStorage.setItem('refreshToken', loginResponse.refresh_token);
                    var expiration = new Date();
                    expiration
                        .setSeconds(expiration.getSeconds() + loginResponse.expires_in);
                    localStorage
                        .setItem('expiration', expiration);
                    WebRestangular
                        .setDefaultHeaders({
                            Authorization: 'bearer ' + loginResponse.access_token
                        });
                    MobileRestangular
                        .setDefaultHeaders({
                            Authorization: 'bearer ' + loginResponse.access_token
                        });
                    request.resolve();
                })
                .catch(function (errorLogin) {
                    request.reject(errorLogin);
                });

            return request.promise;
        }

        function getToken(userName, password) {
            var data = {
                grant_type: 'password',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                username: userName,
                password: password
            };

            return authenticate(data);
        }

        function refreshToken() {
            var data = {
                grant_type: 'refresh_token',
                client_id: EnvironmentConfig.site.oauth.clientId,
                client_secret: EnvironmentConfig.site.oauth.clientSecret,
                refresh_token: localStorage.getItem('refreshToken')
            };

            return authenticate(data);
        }

        function isValidToken() {
            if (localStorage.getItem('expiration')) {
                return compareDates();
            }
            else {
                return false;
            }
        }

        function canRefresh() {
            if (localStorage.getItem('refreshToken')) {
                return true;
            }
            return false;
        }

        function revokeToken() {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expiration');
            localStorage.removeItem('roles');
            localStorage.removeItem('keepSession');
        }

        function compareDates() {
            if (localStorage.getItem('expiration')) {
                var date_expiration = localStorage.getItem('expiration');
                var now = new Date();
                var expiration = new Date(date_expiration);
                return expiration > now;
            }
            else {
                return false;
            }
        }

    }

})();
