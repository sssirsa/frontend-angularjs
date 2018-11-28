/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function(){
    'use_strict';//

    angular
        .module('app.mainApp')
        .factory('groups',groups);
    function groups(
        API,
        URLS
    ) {
        var urlbase = API.all(URLS.genesis.base).all(URLS.grupos);

        return {
            list:list
        };

        function list(){
            return urlbase.customGET();
        }

    }
})();
