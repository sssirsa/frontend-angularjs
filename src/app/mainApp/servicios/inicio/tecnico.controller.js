/**
 * Created by Emmanuel on 05/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('tecnicoController', tecnicoController);

    function tecnicoController(User, RoleStore) {
        var vm = this;
        vm.user = User.getUser();
        vm.roles = _.keys(RoleStore.getStore());
    }


})();
