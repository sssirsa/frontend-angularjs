(function () {
    angular
        .module('app.mainApp.management.restrictions')
        .config(RestrictionsConfig);
    function RestrictionsConfig($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management/restrictions');
    }
})();
