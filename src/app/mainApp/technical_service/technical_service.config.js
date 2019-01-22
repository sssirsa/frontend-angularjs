(function () {
    angular
        .module('app.mainApp.technical_service')
        .config(TechnicalServiceConfig);
    function TechnicalServiceConfig(
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/technical_service');
    }
}) ();
