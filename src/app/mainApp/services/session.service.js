(function() {
    'use strict';
    angular
        .module('app')
        .service('Session', Session);
    /* @ngInject */
    function Session() {
        //TODO: Change login and permissions functionality
        this.create = function ( userInformation, userRole) {
            this.userInformation=userInformation;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.userRole = null;
            this.userInformation=null;
        };
    }
})();
