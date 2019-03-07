(function () {
    angular
        .module('app.mainApp.external_service')
        .config(ExternalServiceConfig);
    function ExternalServiceConfig(
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/external_service');
    }
}) ();
