(function () {
    angular
        .module('app.mainApp.entries')
        .service('MASSIVE_ENTRIES', MassiveEntriesProvider);

    function MassiveEntriesProvider(WebRestangular, $q, URLS) {
        const baseUrl = WebRestangular.all(URLS.massiveEntries);//Modify the URL when given
    }

}) ();
