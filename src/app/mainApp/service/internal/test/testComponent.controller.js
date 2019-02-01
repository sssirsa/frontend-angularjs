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
        vm.onElementSelect = onElementSelect;
        vm.infogral=infogral;
        vm.onStart=onStart;
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

        function onElementSelect(element) {
            getDuplicity(element.insumo_lote_id);
            vm.insumos_lote.push(element);
            console.log("La Lista de Insumos Lote usados:");
            console.log(vm.insumos_lote);


        }
        function onStart(startDate){
            console.log(startDate);
        }

        function getDuplicity(bulkAssetToFind) {
            var index;
            for (index = 0; index < vm.insumos_lote.length; ++index) {
                if (vm.insumos_lote[index].insumo_lote_id === bulkAssetToFind) {
                    vm.insumos_lote.splice(index, 1);
                }
            }


        }

        function infogral(cabinet) {
            vm.asset=cabinet;
        }
    }


})();
