(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('storesController', storesController);

    /* @ngInject */
    function storesController(URLS,
                              Upload,
                              EnvironmentConfig,
                              $cookieStore,
                              toastr,
                              $log,
                              $state,
                              Translate) {
        var vm = this;

        vm.files = null;

        vm.selectFiles = selectFiles;
        vm.uploadTemplate = uploadTemplate;

        vm.templateUrl = URLS.establecimiento_template;

        function selectFiles(files) {
            vm.files = files;
        }

        function uploadTemplate() {
            if (vm.files.length > 0) {
                var file ={file:vm.files[0]};
                vm.uploadPromise = Upload.upload({
                    url: EnvironmentConfig.site.rest.mobile_api + '/' + URLS.massive.store,
                    headers: {'Authorization': "Bearer " + $cookieStore.get('token')},
                    method: 'POST',
                    data: file
                })
                    .then(function () {
                        toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_SUCCESS'));

                        //TODO: Change to the massive upload screen when it exists
                        $state.go('triangular.admin-default.bienvenida');
                    })
                    .catch(function (errorUpload) {
                        $log.error(errorUpload);
                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_ERROR'));
                    });
            }
        }

    }

})();
