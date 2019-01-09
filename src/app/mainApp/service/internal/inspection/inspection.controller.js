/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('inspectionController', inspectionController);
    function inspectionController($scope, Translate, toastr, cabinetUC, ErrorHandler) {
        var vm = this;
        vm.asset = {};//objeto contenedor del cabinet
        vm.asset_id=''; //asset identifier
        vm.title_info=Translate.translate('INSPECTION.GENERAL_INFO');
        vm.assets_info=Translate.translate('INSPECTION.BULK_ASSETS');

        vm.search_asset = search_asset;
        function search_asset() {
            //Search in cabinets location
            var promiseCabinetInfo = cabinetUC.getByID(vm.asset_id);
            promiseCabinetInfo.then(function (asset) {
                vm.asset = asset;
                //selection subsidiary
                console.log(vm.asset);


            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });

        }


    }


})();
