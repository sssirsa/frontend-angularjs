(function () {
    angular
        .module('app.mainApp.entries')
        .service('MANUAL_ENTRIES', ManualEntriesProvider);

    function ManualEntriesProvider(WebRestangular, $q, URLS) {
        const baseUrl = WebRestangular.all(URLS.manualEntries);//Modify the URL when known
        const urls = URLS.entries;

        function createNew(element) {
            return baseUrl.all(urls.new).customPOST(element);
        }

        function createWarranty(element) {
            return baseUrl.all(urls.warranty).customPOST(element);
        }

        function createObsolete(element) {
            return baseUrl.all(urls.obsolete).customPOST(element);
        }

        function createUnrecognizable(element) {
            return baseUrl.all(urls.unrecognizable).customPOST(element);
        }

        function addCabinet(id, element) {
            return baseUrl.all(urls.addCabinet).all(id).customPUT(element);
        }

        function detail(id) {
            return baseUrl.all(urls.close).all(id).customGET();
        }

        function close(id, element) {
            return baseUrl.all(urls.close).all(id).customPUT(element);
        }

        return {
            createNew: createNew,
            createWarranty: createWarranty,
            createObsolete: createObsolete,
            createUnrecognizable: createUnrecognizable,
            addCabinet: addCabinet
        }

    }

})();
