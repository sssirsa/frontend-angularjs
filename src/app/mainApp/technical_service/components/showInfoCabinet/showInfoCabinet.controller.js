/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('showInfoAsset', {
            templateUrl: 'app/mainApp/technical_service/components/showInfoCabinet/showInfoCabinet.tmpl.html',
            controller: showInfoCabinetController,
            bindings: {
                asset:'<'

            }
        });
    function showInfoCabinetController($mdDialog) {
        var vm = this;
        vm.showInfoCabinetDialog=showInfoCabinetDialog;

        function showInfoCabinetDialog(ev) {
            vm.meta=[
                {
                    section:"Economico",
                    icon:'fas fa-snowflake',
                    key:'economico',
                    kind:'field'

                },
                {
                    section:"No. de Activo",
                    icon:'fas fa-hashtag',
                    key:'id_unilever',
                    kind:'field'

                },
                {
                    section:"No. de Serie",
                    icon:'fas fa-hashtag',
                    key:'no_serie',
                    kind:'field'

                },
                {
                    section:"Año",
                    icon:'fas fa-hashtag',
                    key:'year',
                    kind:'field'

                },
                {
                    section:"Económicos anteriores",
                    icon:'fab fa-slack-hash',
                    key:'historial_economicos',
                    kind:'multiple'

                },
                {
                    section:"Pedimento",
                    icon:'fas fa-file-invoice',
                    key:'pedimento',
                    kind:'object',
                    content:[
                        {
                            key:'descripcion',
                            label:'Pedimento 2 XD',
                            type:'field'
                        }
                    ]

                },
                {
                    section:"Modelo",
                    icon:'fas fa-tags',
                    key:'modelo',
                    kind:'object',
                    content:[
                        {
                            key:'nombre',
                            label:'Modelo',
                            type:'field'
                        },
                        {
                            key:'descripcion',
                            label:'Descripción',
                            type:'field'
                        },
                        {
                            key:'tipo_nombre',
                            label:'Tipo Equipo',
                            type:'field'
                        },
                        {
                            key:'palabra_clave',
                            label:'Palabra Clave',
                            type:'field'
                        },
                        {
                            label:"Marca",
                            icon:'fas fa-tag',
                            key:'marca',
                            type:'object',
                            content:[
                                {
                                    key:'nombre',
                                    label:'Marca',
                                    type:'field'
                                },
                                {
                                    key:'descripcion',
                                    label:'Descripción',
                                    type:'field'
                                }
                            ]
                        }
                    ]

                },
                { section:"Codigo QR",
                    icon:'fas fa-qrcode',
                    key:'qr_code',
                    kind:'image'
                }




            ];
            $mdDialog.show({
                controller: 'showInfotDialogController',
                templateUrl: 'app/mainApp/components/dialogShowInfo/showInfoDialog.tmpl.html',
                controllerAs: 'vm',
                locals: {
                    array: vm.asset,
                    meta:vm.meta,
                    title:'Información del Cabinet'
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
