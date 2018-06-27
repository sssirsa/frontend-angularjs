(function () {
    angular
        .module('app.mainApp.departures')
        .config(departuresConfig);

    function departuresConfig($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/departures');
    }
})();
