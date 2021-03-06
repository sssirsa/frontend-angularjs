(function () {
    angular
        .module('app')
        .factory('OAuth', OAuthProvider);

    function OAuthProvider(
        EnvironmentConfig,
        API,
        $q,
        $http,
        $cookies,
        URLS
    ) {
        return {
            getToken: getToken,
            refreshToken: refreshToken,
            isValidToken: isValidToken,
            canRefresh: canRefresh,
            revokeToken: revokeToken
        };

        function authenticate(params) {
            var request = $q.defer();

            API
                .all(URLS.management.oauth.base)
                .all(URLS.management.base)
                .all(URLS.management.oauth.login)
                //.customPOST({ 'content-type': 'application/json' }, null, params)
                .customPOST(params)
                .then(function (loginResponse) {
                    $cookies.putObject('token', loginResponse.access_token);
                    $cookies.putObject('refreshToken', loginResponse.refresh_token);
                    var expiration = new Date();
                    expiration
                        .setSeconds(expiration.getSeconds() + loginResponse.expires_in);
                    $cookies
                        .putObject('expiration', expiration);
                    request.resolve(loginResponse);
                })
                .catch(function (errorLogin) {
                    request.reject(errorLogin);
                });

            return request.promise;
        }

        function getToken(userName, password) {
            // var data = {
            //     grant_type: 'password',
            //     client_id: EnvironmentConfig.site.oauth.clientId,
            //     client_secret: EnvironmentConfig.site.oauth.clientSecret,
            //     username: userName,
            //     password: password
            // };
            var data = {
                username: userName,
                password: password
            };

            return authenticate(data);
        }

        function refreshToken() {
            // var data = {
            //     grant_type: 'refresh_token',
            //     client_id: EnvironmentConfig.site.oauth.clientId,
            //     client_secret: EnvironmentConfig.site.oauth.clientSecret,
            //     refresh_token: $cookies.getObject('refreshToken')
            // };
            var data = {
                refresh_token: $cookies.getObject('refreshToken')
            };
            return authenticate(data);
        }

        function isValidToken() {
            if ($cookies.getObject('expiration')) {
                return compareDates();
            }
            else {
                return false;
            }
        }

        function canRefresh() {
            if ($cookies.getObject('refreshToken')) {
                return true;
            }
            return false;
        }

        function revokeToken() {
            $cookies.remove('token');
            $cookies.remove('refreshToken');
            $cookies.remove('expiration');
            $cookies.remove('keepSession');
        }

        function compareDates() {
            if ($cookies.getObject('expiration')) {
                var date_expiration = $cookies.getObject('expiration');
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
