(function () {
    angular
    .module('app.mainApp.entries_deppartures.changes')
    .factory('MANUAL_CHANGES', ManualChangesProvider);
    function ManualChangesProvider(
        API,
        $q,
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
        ) {

    }
})();
