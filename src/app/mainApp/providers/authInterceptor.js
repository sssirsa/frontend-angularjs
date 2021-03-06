(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthInterceptor', AuthInterceptor);

    /* @ngInject */
    function AuthInterceptor($injector, $q) {
        var inFlightGet = null;
        var inFlightRefresh = null;
        return {
            request: request,
            response: response,
            responseError: responseError
        };

        function request(config) {
            var deferred = $q.defer();
            if (config.url.indexOf('oauth') === -1) {
                if (!inFlightGet) {
                    //Adding authorization header to every request that is not from oauth
                    inFlightGet = $injector.get('AuthService').getToken();
                    config.headers.Authorization = 'Bearer ' + inFlightGet;
                    inFlightGet = null;
                }
            }
            deferred.resolve(config);
            return deferred.promise;

        }

        function response(res) {
            return res;
        }

        function responseError(response) {
            if (response.status === 401
                && response.statusText === 'Unauthorized'
                && !response.data.error_description
                && !response.config.url.endsWith('oauth/token/')
            ) {
                var deferred = $q.defer();
                var $http = $injector.get('$http');
                if (!inFlightRefresh) {
                    inFlightRefresh = $injector.get('OAuth').refreshToken();
                }
                inFlightRefresh.then(function () {
                    inFlightRefresh = null;
                    // response.config.headers.Authorization = 'Bearer ' + $cookies.getObject('token');
                    //response.config.headers.Authorization = 'Bearer ' + $injector.get('AuthService').getToken();
                    $http(response.config).then(deferred.resolve, deferred.reject);
                });
                return deferred.promise;
            }
            return $q.reject(response);
        }
    }
})();
