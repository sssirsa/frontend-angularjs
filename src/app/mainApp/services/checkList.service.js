/**
 * Created by franciscojaviercerdamartinez on 18/07/16.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .factory('CheckList', CheckList);

    /* @ngInject */
    function CheckList(WebRestangular, URLS) {
        var urlbase = WebRestangular.all(URLS.checklist);

        return {
            crearCheckListServicio: crearCheckListServicio,
            consultarCheckListServicio: consultarCheckListServicio,
            editarCheckListServicio: editarCheckListServicio,
            eliminarCheckListServicio: eliminarCheckListServicio,
            getAllCheckListServicio: getAllCheckListServicio
        };


        function crearCheckListServicio(CheckList) {
            return urlbase.customPOST(CheckList);
        }

        function consultarCheckListServicio(CheckList) {
            return urlbase.all(CheckList.id).customGET(CheckList);
        }

        function editarCheckListServicio(CheckList) {
            return urlbase.one('CheckList', CheckList.id).customPOST(CheckList);
        }

        function eliminarCheckListServicio(CheckList) {
            return urlbase.all(CheckList.id).customDELETE();
        }


        function getAllCheckListServicio(CheckList) {
            return urlbase.all(CheckList.idCabinet).customGET(CheckList);
        }

    }

})();
