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
        var baseModeloGroups = MobileRestangular.all(URLS.group_employee);

        return {
            getGroups:getGroups,
            allGroups:allGroups,
            createGroup:createGroup
        };


        function getGroups(username){
            return baseModelo.all(username).getList();
        }
        function allGroups() {
            return baseModeloGroups.getList()

        }
        function createGroup(object) {
            return baseModelo.customPOST(object);
        }


    }
})();
