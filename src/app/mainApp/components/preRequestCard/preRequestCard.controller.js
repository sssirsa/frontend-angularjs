(function () {

    angular
        .module('app.mainApp')
        .component('preRequestItem', {
            templateUrl: 'app/mainApp/components/preRequestCard/preRequestCard.tmpl.html',
            controller: preRequestItemController,
            bindings: {
                pre: '<'
            }
        });

    /* @ngInject */
    function preRequestItemController() {
        var vm = this;
        console.log(vm.pre);

    }

})();
