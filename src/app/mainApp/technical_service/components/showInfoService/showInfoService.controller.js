/**
 * Created by franciscojaviercerdamartinez on 2/1/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoServicio', {
            templateUrl: 'app/mainApp/technical_service/components/showInfoService/showInfoService.tmpl.html',
            controller: showInfoServiceController,
            bindings: {
                info: '<'

            }
        });
    function showInfoServiceController($mdDialog, showInfoProvider,ErrorHandler) {
        var vm = this;

        vm.showInfoServiceDialog=showInfoServiceDialog;
        init();
        function init() {
            console.log(vm.info);
            if (vm.info.currentStage) {
                var infoserviceProvider = showInfoProvider.getService(vm.info.currentStage.servicio_cabinet);
                infoserviceProvider.then(function (servicio) {
                    vm.service = servicio;

                }).catch(function (errormsg){
                    ErrorHandler.errorTranslate(errormsg);
                });
            }
        }

        function showInfoServiceDialog(ev) {
            vm.meta=[
                {
                    section:"Economico",
                    icon:'fas fa-snowflake',
                    key:'cabinet',
                    kind:'field'

                },
                {
                    section:"Fecha de Inicio de Servicio",
                    icon:'fas fa-snowflake',
                    key:'fecha_inicio',
                    kind:'field'

                },{
                    section:"Fecha de Fin de Servicio",
                    icon:'fas fa-snowflake',
                    key:'fecha_fin',
                    kind:'field'

                },
                {
                    section:"Etapa Actual",
                    icon:'fas fa-tags',
                    key:'etapa_actual',
                    kind:'object',
                    content:[
                        {
                            label:"Etapa",
                            icon:'fas fa-tag',
                            key:'etapa',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre de Etapa',
                                    type:'field'
                                },
                                {
                                    key:'tipo_etapa',
                                    label:'Tipo de Etapa',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            label:"Tecnico",
                            icon:'fas fa-user',
                            key:'persona',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre',
                                    type:'field'
                                },
                                {
                                    key:'apellido_paterno',
                                    label:'Apellido Paterno',
                                    type:'field'
                                },
                                {
                                    key:'apellido_materno',
                                    label:'Apellido Materno',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            label:"Sucursal",
                            icon:'fas fa-factory',
                            key:'sucursal',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            key:'fecha_fin',
                            label:'Fecha Fin',
                            type:'field'
                        },
                        {
                            key:'fecha_inicio',
                            label:'Inicio de Servicio',
                            type:'field'
                        },
                        {
                            key:'fecha_entrada',
                            label:'Entrada al servicio',
                            type:'field'
                        }

                    ]

                },
                {
                    section:"Etapa Anterior",
                    icon:'fas fa-tags',
                    key:'etapa_anterior',
                    kind:'object',
                    content:[
                        {
                            label:"Etapa",
                            icon:'fas fa-tag',
                            key:'etapa',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre de Etapa',
                                    type:'field'
                                },
                                {
                                    key:'tipo_etapa',
                                    label:'Tipo de Etapa',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            label:"Tecnico",
                            icon:'fas fa-user',
                            key:'persona',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre',
                                    type:'field'
                                },
                                {
                                    key:'apellido_paterno',
                                    label:'Apellido Paterno',
                                    type:'field'
                                },
                                {
                                    key:'apellido_materno',
                                    label:'Apellido Materno',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            label:"Sucursal",
                            icon:'fas fa-factory',
                            key:'sucursal',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Nombre',
                                    type:'field'
                                }
                            ]
                        },
                        {
                            key:'fecha_fin',
                            label:'Fecha Fin',
                            type:'field'
                        },
                        {
                            key:'fecha_inicio',
                            label:'Inicio de Servicio',
                            type:'field'
                        },
                        {
                            key:'fecha_entrada',
                            label:'Entrada al servicio',
                            type:'field'
                        }

                    ]

                }

            ];
            $mdDialog.show({
                controller: 'showInfotDialogController',
                templateUrl: 'app/mainApp/components/dialogShowInfo/showInfoDialog.tmpl.html',
                controllerAs: 'vm',
                locals: {
                    array: vm.service,
                    meta:vm.meta,
                    title:'Información del Servicio'
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                fullscreen: true,
                focusOnOpen: false,

            }).then(function (answer) {
                //Accepted
                $mdDialog.hide();
            }, function () {
                //Cancelled
                $mdDialog.cancel();
            });
        }


    }
})();
