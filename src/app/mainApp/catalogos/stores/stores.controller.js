(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('storesController', storesController);

    /* @ngInject */
    function storesController(URLS,
                              Upload,
                              EnvironmentConfig,
                              $cookies,
                              toastr,
                              $log,
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
                vm.uploadPromise = Upload.upload({
                    url: EnvironmentConfig.site.rest.web_api + '/' + URLS.massive.store,
                    headers: {'Authorization': $cookies.get('token')},
                    method: 'POST',
                    data: vm.files
                })
                    .then(function () {
                        toastr.success(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_SUCCESS'));
                    })
                    .catch(function (errorUpload) {
                        $log.error(errorUpload);
                        toastr.error(Translate.translate('MAIN.COMPONENTS.STORE_MANAGER.TOASTR.MASSIVE_ERROR'));
                    });
            }
        }

    }

})();
