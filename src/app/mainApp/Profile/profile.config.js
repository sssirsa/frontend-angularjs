/**
 * Created by lockonDaniel on 6/2/16.
 */
(function () {
    angular
        .module('app.mainApp.profile')
        .config(moduleConfig);

    function moduleConfig($stateProvider, triMenuProvider){
        $stateProvider
            .state('triangular.admin-default.profile',{
                url:'/profile',
                templateUrl:'app/mainApp/profile/Pruebas.html',
                controller:'Prueba',
                controllerAs:'vm'
            });

        /*triMenuProvider.addMenu({
            name: 'Solicitudes',
            icon: 'zmdi zmdi-bookmark',
            type: 'dropdown',
            priority: 4.1,
            children: [{
                name: 'Crear Solicitud',
                state: 'triangular.admin-default.realizarSolicitud',
                type: 'link'
            },{
                name: 'Buscar Solicitud',
                state: 'triangular.admin-default.buscarSolicitud',
                type: 'link'
            }

            ]
        });*/
    }



})();