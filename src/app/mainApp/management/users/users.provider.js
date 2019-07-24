(function () {
    angular
        .module('app.mainApp.management.users')
        .factory('USERS', UsersProvider);
    function UsersProvider(
        API,
        EnvironmentConfig,
        URLS
    ) {

        var personUrl = API.all(URLS.management.base
            + '/' + URLS.management.administration.base
            + '/' + URLS.management.administration.person);

        var getUserDetail = function getUserDetail(id) {
            return personUrl.customGET(id);
        };

        var modifyPerson = function modifyPerson(id, element) {
            return personUrl.all(id).customPUT(element);
        };

        return {
            getUserDetail: getUserDetail,
            modifyPerson: modifyPerson
        };

    }
})();
