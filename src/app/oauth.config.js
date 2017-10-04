/**
 * Created by Emmanuel on 15/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .config(OauthConfig)
        .config(tokenConfig);

    function OauthConfig(OAuthProvider, EnvironmentConfig, URLS) {
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                //EnvironmentConfig.site.rest.api+'mobile-dev/oauth/'
                baseUrl = EnvironmentConfig.site.rest.api + URLS.environment.mobile_dev + /oauth/;
                break;
            case 'staging':
                baseUrl = EnvironmentConfig.site.rest.api + URLS.environment.mobile_stg + /oauth/;
                break;
            case 'production':
                baseUrl = EnvironmentConfig.site.rest.api + URLS.environment.mobile + /oauth/;
                break;
            case 'local':
                baseUrl = EnvironmentConfig.site.rest.api + URLS.environment.mobile_local + /oauth/;
                break;
        }
        OAuthProvider.configure({
            baseUrl: baseUrl,
            clientId: EnvironmentConfig.site.oauth.clientId,
            clientSecret: EnvironmentConfig.site.oauth.clientSecret,
            grantPath: 'token/',
            revokePath: 'revoke_token/'
        });
    }

    function tokenConfig(OAuthTokenProvider) {
        OAuthTokenProvider.configure({name: 'token', options: {secure: false}});
    }

})();
