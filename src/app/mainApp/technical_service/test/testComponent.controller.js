/**
 * Created by franciscojaviercerdamartinez on 1/14/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('testComponentController', testComponentController);

    function testComponentController() {
        var vm = this;
        vm.infogral=infogral;
        vm.infoStep=infoStep;
        vm.onStart=onStart;
        vm.getInsumosLote=getInsumosLote;
        vm.nextStep=nextStep;
        vm.getFailures=getFailures;
        vm.insumos_lote = [];

        vm.maxStock = 4;
        vm.sucursal = 1;
        vm.bulk = {
            id: 9,
            tipo_equipo: {
                id: 1,
                nombre: "AT1"
            },
            catalogo_insumo_lote: {
                id: 4,
                descripcion: "insumo lote 1",
                costo: "1000.000",
                tipo_componente: {
                    com_code: "3536940401",
                    nombre: "tipo componente 1"
                },
                categoria_insumo: {
                    com_code: "353601",
                    nombre: "categoria prueba 1"
                },
                modelo_insumo: {
                    id: 1,
                    marca: {
                        id: 1,
                        descripcion: "marca insumo 1 prueba local lexus"
                    },
                    marca_descripcion: "marca insumo 1 prueba local lexus",
                    deleted: false,
                    descripcion: "modelo insumo 1 de prueba local lexus"
                },
                stock: [
                    {
                        id: 6,
                        sucursal: {
                            id: 1,
                            nombre: "SSSIRSA Leon",
                            responsable: "RUBEN LOPEZ LOPEZ"
                        },
                        cantidad: "98.000"
                    },
                    {
                        id: 8,
                        sucursal: {
                            id: 13,
                            nombre: "escom",
                            responsable: "Chadwick"
                        },
                        cantidad: "10.000"
                    }
                ]
            },
            catalogo_etapa: {
                id: 1,
                nombre: "Checklist",
                tipo_etapa: "Checklist"
            },
            cantidad: "2.000"
        };

        function getInsumosLote(element){
            vm.insumos_lote=element;
            console.log(vm.insumos_lote);
        }
        function onStart(startDate){
            console.log(startDate);
        }




        function infogral(cabinet) {
            vm.asset=cabinet;
        }
        function infoStep(step) {
            vm.step=step;
            console.log("sucursal de step");
            console.log(vm.step.control.sucursal);
        }
        function nextStep(step) {
            console.log(step);

        }
        function getFailures(failures) {
            vm.failures = failures;
            console.log(vm.failures);

        }
    }


})();
