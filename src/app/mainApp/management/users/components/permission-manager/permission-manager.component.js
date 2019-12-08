(function () {
    angular
        .module('app.mainApp.management.users')
        .component('permissionManager', {
            templateUrl: 'app/mainApp/management/users/components/permission-manager/permission-manager.tmpl.html',
            controller: PermissionManagerController,
            bindings: {
                canEdit: '<', //Boolean, if false, the permissions will only be seen and can't be modified
                permissions:'=' //Bidirectional bindings, permissions-array
            }
        });
    function PermissionManagerController() {

    }
}) ();
