(function () {
    angular
        .module('app.mainApp.entries_departures')
        .config(EntriesDeparturesConfig);
    function EntriesDeparturesConfig(
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures');
    }
}) ();
