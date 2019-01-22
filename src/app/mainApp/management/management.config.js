(function () {
    angular
        .module('app.mainApp.management')
        .config(ManagementConfig);
    function ManagementConfig(
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management');
    }
})();
