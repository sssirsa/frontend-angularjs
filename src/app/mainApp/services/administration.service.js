/**
 * Created by Christian Adan Israel Amezccua Aguilar.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Administration',Administration);

    function Administration(MobileRestangular, URLS){

        var baseModelo = MobileRestangular.all(URLS.grupo_persona);

        return {
            getGroups:getGroups
        };


        function getGroups(username){
            return baseModelo.all(username).getList();
        }



    }
})();
