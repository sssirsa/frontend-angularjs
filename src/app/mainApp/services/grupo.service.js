/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function(){
    'use_strict';//

    angular
        .module('app.mainApp')
        .factory('groups',groups);
    function groups(WebRestangular, URLS){
        var urlbase = WebRestangular.all(URLS.grupos);

        return {
            list:list
        };

        function list(){
            return urlbase.customGET();
        }

    }
})();
