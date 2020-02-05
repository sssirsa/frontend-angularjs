(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('Person', personaProvider);

    function personaProvider(
        API,
        URLS,
        _
    ) {
        var PersonBaseURL = API
            .all(URLS.management.oauth.base)
            .all(URLS.management.base);

        function getMyProfile(personID) {

            var queryString = '?id=' + personID;
            return PersonBaseURL
                .all(URLS.management.oauth.person + queryString)
                .customGET(null);
        }

        function listPersons(limit, offset, filter) {
            var params = { limit: limit, offset: offset };
            if (angular.isDefined(filter)) {
                params = _.extend(params, filter);
            }
            return PersonBaseURL
                .customGET(URLS.management.administration.person, params);
        }

        function getPerson(personID) {
            return PersonBaseURL
                .all(URLS.management.administration.person)
                .customGET(personID);
        }

        function createPerson(personData) {
            return PersonBaseURL
                .all(URLS.management.administration.person)
                .post(personData);
        }

        function updatePerson(personID, personData) {
            return PersonBaseURL
                .all(URLS.management.administration.person)
                .all(personID)
                .customPUT(personData);
        }

        return {
            getMyProfile: getMyProfile,
            listPersons: listPersons,
            getPerson: getPerson,
            createPerson: createPerson,
            updatePerson: updatePerson
        };

    }

})();
