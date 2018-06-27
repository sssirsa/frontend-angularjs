(function () {
    angular
        .module('app.mainApp.entries')
        .config(entriesConfig);

    function entriesConfig($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries');
    }
})();
