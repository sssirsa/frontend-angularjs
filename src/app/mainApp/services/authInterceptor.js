/**
 * Created by Christian amezcua on 17/10/16.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .service('AuthInterceptor', AuthInterceptor);

    /* @ngInject */
    function AuthInterceptor($injector, $q, EnvironmentConfig) {
        var inFlightGet = null;
        var inFlightRefresh = null;
        return {
            request: request,
            response: response,
            responseError: responseError
        };

        function request(config) {
            var deferred=$q.defer();
            if ((config.url.indexOf(EnvironmentConfig.site.rest.api) !== -1) && (config.url.indexOf('oauth') === -1)){
                if (!inFlightGet) {
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
            console.log(response);
            if (response.status === 401 && response.statusText === 'Unauthorized') {
                console.log("Entro");
                var deferred = $q.defer();
                var $http = $injector.get('$http');
                if (!inFlightRefresh) {
                    console.log("refresh");
                    inFlightRefresh = $injector.get('OAuth').refreshToken();
                }
                inFlightRefresh.then(function() {
                    inFlightRefresh = null;
                    console.log("solicito token");
                    $http(response.config).then(deferred.resolve, deferred.reject);
                }).catch(function (err) {
                    console.log(err);
                });
                return deferred.promise
            }
            return $q.reject(response);
        }

    }
})();
