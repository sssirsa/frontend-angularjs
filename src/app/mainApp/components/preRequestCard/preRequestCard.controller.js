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
    function preRequestItemController($state) {
        var ctrl = this;

        ctrl.statusDetail=statusDetail;

        function statusDetail() {
            $state.go('triangular.admin-default.preRequestDetail', {idPreRequest: ctrl.pre.id});
        }

    }

})();
