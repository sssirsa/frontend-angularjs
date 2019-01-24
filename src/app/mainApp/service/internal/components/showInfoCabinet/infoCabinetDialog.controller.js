/**
 * Created by franciscojaviercerdamartinez on 1/22/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('showInfoCabinetDialogController', showInfoCabinetDialogController);

    function showInfoCabinetDialogController(array, title,$mdDialog) {
        var vm = this;
        vm.conversion = [];
        vm.contenido = array;
        vm.title=title;
        vm.closeDialog=closeDialog;
        vm.array = {
            nombre: "Francisco Javier",
            apellidoP: "Cerda",
            apellidoM: "Martínez",
            address: {
                calle: 'Av. Siempre Viva',
                number: 264,
                delegation: "Springfield",
                phone: [
                    '55555555', '6666666666', '77777777'
                ]
            },
            address2: {
                calle: 'Evengreen Terrace',
                number: 265,
                delegation: "Springfield",
                phone: [
                    '11111111', '222222222', '33333333'
                ]
            },
            age:25,
            description:"Es bien CHIDO"
        };
        vm.meta=[
            {
                section:"Nombre del Usuario",
                icon:'fas fa-user',
                key:'nombre',
                kind:'field'

            },
            {
                section:"Apellido Paterno",
                key:'apellidoP',
                kind:'field'

            },
            {
                section:"Apellido Materno",
                key:'apellidoM',
                kind:'field'

            },
            {
                section:"Edad",
                key:'age',
                kind:'field'

            },
            {
                section:"Descripción",
                key:'description',
                kind:'field'

            },
            {
                section:"Dirección",
                key:'address',
                kind:'object',
                content:[
                    {
                        key:'calle',
                        label:'Calle',
                        type:'field'
                    },
                    {
                        key:'number',
                        label:'Número',
                        type:'field'
                    },
                    {
                        key:'delegation',
                        label:'Alcaldía',
                        type:'field'
                    },
                    {
                        key:'phone',
                        label:'Números Telefonicos',
                        type:'multiple'
                    }
                ]

            },
            {
                section:"Dirección 2",
                key:'address2',
                kind:'object',
                content:[
                    {
                        key:'calle',
                        label:'Calle',
                        type:'field'
                    },
                    {
                        key:'number',
                        label:'Número',
                        type:'field'
                    },
                    {
                        key:'delegation',
                        label:'Alcaldía',
                        type:'field'
                    },
                    {
                        key:'phone',
                        label:'Números Telefonicos',
                        type:'multiple'
                    }
                ]

            }


        ]
        var object = [
            {
                section: 'Nombre de la sección', //Nombre del Campo a Mostrar
                key: 'asset',//
                icon:'fas fa-user',//Icono de zmdi o font awsome
                kind: 'Object',// se específica el tipo si es objeto ='Object' o campo 'Field'
                content: [ //Definición independiente del Objeto en Cuestíon
                    {
                        key: '',//Nombre del Key en el Objeto
                        label: '',//Nombre de la variable a mostrar
                        type: 'field' //field only value, multiple value
                    },
                    {
                        key: '',//Nombre del Key en el Objeto
                        label: '',//Nombre de la variable a mostrar
                        type: 'field' //field only value stringify, multiple value stringify, file archivo URL, IMAGE imagen
                    }
                ]
            }];


        //show();
        function show() {
            console.log(cabinet);
            vm.asset = cabinet;
            vm.fields = cabinet;
            for (var key in vm.fields) {
                if (_.isObject(vm.fields[key])) {
                    vm[key] = _.pairs(vm.fields[key]);
                    vm.conversion.push(vm[key]);
                    delete vm.fields[key];
                }
            }
            vm.conversion.push(_.pairs(vm.fields));
            console.log(vm.conversion);


        }

        function closeDialog() {

            $mdDialog.cancel();
        }
    }


})();
