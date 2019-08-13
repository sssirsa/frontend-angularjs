/**
 * Created by franciscojaviercerdamartinez on 8/13/19.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('createMassiveLoadController', createMassiveLoadController);

    function createMassiveLoadController($mdDialog,ErrorHandler, MassiveLoadProvider,Upload, EnvironmentConfig,$cookies,toastr,$log,Translate,MASSIVE_CHARGE) {
        var vm = this;

        //variables


        //funciones
        vm.cerrar = cerrar;
        vm.clean = clean;
        vm.selectFiles=selectFiles;
        vm.save=save;

        init();

        function cerrar() {
            $mdDialog.cancel(null);
        }

        function init() {
            listMassiveLoadsType();
        }
        function listMassiveLoadsType() {
            vm.promiseMassiveLoadTypeList = MassiveLoadProvider.getMassiveLoadType()
                .then(function (listType) {
                    vm.massive_charge_kind = listType.results;
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });
        }
        function selectFiles(files) {
            vm.files = files;
        }

        function clean() {
            vm.infoMassiveLoad = null;
            vm.tipo=null;
            vm.files=null;
        }
        function save() {
            if (vm.files.length > 0) {
                var file ={
                    bulk_load_id:vm.tipo.id,
                    file:vm.files[0]};
                vm.uploadPromise = Upload.upload({
                    url: EnvironmentConfig.site.rest.api + '/' + MASSIVE_CHARGE.project+'/'+ MASSIVE_CHARGE.base+'/'+MASSIVE_CHARGE.actions.bulk,
                    headers: {'Authorization': "Bearer " + $cookies.get('token')},
                    method: 'POST',
                    data: file
                })
                    .then(function () {
                        toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_SUCCESS'));
                        cerrar();
                    })
                    .catch(function (errorUpload) {
                        $log.error(errorUpload);
                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_ERROR'));
                    });
            }
        }


    }

})();
