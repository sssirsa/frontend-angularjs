/**
 * Created by Christian Adan Israel Amezccua Aguilar.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Administration',Administration);

    function Administration(
        API,
        URLS
    ) {

        var baseModelo = API.all(URLS.mobile.base).all(URLS.grupo_persona);
        var baseModeloGroups = API.all(URLS.mobile.base).all(URLS.group_employee);

        return {
            getGroups:getGroups,
            allGroups:allGroups,
            createGroup:createGroup,
            deleteGroup:deleteGroup
        };


        function getGroups(username){
            return baseModelo.all('user').all(username).getList();
        } 
        function allGroups() {
            return API.all(URLS.mobile.base).all(URLS.group_employee + '?limit=1000').customGET();
        }
        function createGroup(object) {
            return baseModelo.customPOST(object);
        }
        function deleteGroup(id) {
            return baseModelo.customDELETE(id,null,{'content-type':'application/json'});
        }


    }
})();
