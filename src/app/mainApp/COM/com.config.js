(function () {
    angular
        .module('app.mainApp.com')
        .config(COMConfig);
    function COMConfig(
        //$stateProvider,
        $translatePartialLoaderProvider
        //triMenuProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/com');
    }
}) ();
