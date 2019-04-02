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
        MANAGEMENT
    ) {
        var urlbase = API.all(MANAGEMENT.base
            + '/' +MANAGEMENT.administration.base
            + '/' +MANAGEMENT.administration.groups);

        return {
            list:list
        };

        function list(){
            return urlbase.customGET();
        }

    }
})();
