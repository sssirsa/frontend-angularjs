(function () {
    angular
        .module('app.mainApp')
        .factory('Routes', Routes);

    function Routes(MobileRestangular, URLS) {
        var baseURL = MobileRestangular.all(URLS.rutas);

        function list() {
            return baseURL.getList();
        }

        function getByID(id) {
            return baseURL.all(id).customGET();
        }

        function create(object) {
            return baseURL.customPOST(object);
        }

        function remove(id) {
            return baseURL.customDELETE(id, null, {'content-type': 'application/json'});
        }

        function update(object, id) {
            if (id) {
                return baseURL.all(id).customPUT(object);
            }
            else {
                return baseURL.all(object.id).customPUT(object);
            }
        }

        return {
            list: list,
            getByID: getByID,
            create: create,
            remove: remove,
            update: update
        };
    }

})();
