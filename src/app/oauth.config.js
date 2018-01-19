/**
 * Created by Emmanuel on 15/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .config(OauthConfig)
        .config(tokenConfig);

    function OauthConfig(OAuthProvider, EnvironmentConfig) {
        console.log(EnvironmentConfig.site.rest);
        var baseUrl = EnvironmentConfig.site.rest.web_api+'/oauth/';
        /*switch (EnvironmentConfig.environment) {
            case 'development':
                //EnvironmentConfig.site.rest.api+'mobile-dev/oauth/'
                baseUrl = EnvironmentConfig.site.rest.api + '/' + URLS.environment.genesis_dev + /oauth/;
                break;
            case 'staging':
                baseUrl = EnvironmentConfig.site.rest.api + '/' + URLS.environment.genesis_stg + /oauth/;
                break;
            case 'production':
                baseUrl = EnvironmentConfig.site.rest.api + '/' + URLS.environment.genesis + /oauth/;
                break;
            case 'local':
                baseUrl = EnvironmentConfig.site.rest.api + '/' + URLS.environment.genesis_local + /oauth/;
                break;
        }*/
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
