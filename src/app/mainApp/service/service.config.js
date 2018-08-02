(function () {
    angular
        .module('app.mainApp.service')
        .config(serviceConfig);

    function serviceConfig($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/service');
    }
})();
