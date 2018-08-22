(function () {
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('AttentionReportBuilder', AttentionReportBuilder);

    function AttentionReportBuilder(atencionPV, $http, $log, toastr, Translate) {
        var vm = this;


        return {
            buildReport: buildReport
        };

        function buildReport(id) {
            vm.reportToPDF = {
                content: [],
                styles: {}
            };
            vm.reportToPDF.content = [];
            var getInfopromise = atencionPV.getReport(id);
            getInfopromise.then(function (respuesta) {
                vm.infoReport = respuesta;

                $http.get('app/mainApp/service/external/atenciones/report/report.json')
                    .then(function (reporteToPDF) {
                        vm.reportToPDF = reporteToPDF.data;
                        $log.info(vm.reportToPDF);
                        $http.get('app/mainApp/service/external/atenciones/report/report.header.json')
                            .then(function (cabecera) {
                                vm.cabecera = {};
                                vm.cabecera = cabecera.data;
                                vm.cabecera.header.columns[1][4].text = vm.infoReport.folio;
                                vm.cabecera.header.columns[1][5].text = vm.infoReport.tipo;
                                vm.reportToPDF.content.push(vm.cabecera.header);
                                vm.reportToPDF.content.push(vm.cabecera.break);

                                $http.get('app/mainApp/service/external/atenciones/report/report.general_data.json')
                                    .then(function (generalData) {
                                        vm.generalData = generalData.data;

                                        vm.reportToPDF.content.push(vm.generalData.DOUBLE_BLANK);
                                        vm.reportToPDF.content.push(vm.generalData.TITLE);
                                        vm.reportToPDF.content.push(vm.generalData.BLANCK_SPACE);
                                        //Operador Ternario para asignar nombre de Tecnico
                                        vm.generalData.NAME_ATTENTION.columns[1].text = vm.infoReport.persona !== null ? vm.infoReport.persona : 'Técnico NO Registrado';
                                        vm.reportToPDF.content.push(vm.generalData.NAME_ATTENTION);

                                        //Operador Ternario para asignar el estatus de la atención
                                        vm.generalData.ESTATUS.columns[0].columns[1].text = vm.infoReport.status !== null ? vm.infoReport.status : 'Sin Estatus';
                                        //Operador Ternario para asignar la sucursal
                                        vm.generalData.ESTATUS.columns[1].columns[1].text = vm.infoReport.sucursal !== null ? vm.infoReport.sucursal : 'Sin Sucursal';
                                        vm.reportToPDF.content.push(vm.generalData.ESTATUS);

                                        //Operador Ternario para asignar fecha de solicitud

                                        vm.generalData.DATE_REQUEST_ASSIGNEMENT.columns[0].columns[1].text = vm.infoReport.fecha ? moment(vm.infoReport.fecha).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de Solicitud';
                                        //Operador Ternario para asignar la fecha de asignación
                                        vm.generalData.DATE_REQUEST_ASSIGNEMENT.columns[1].columns[1].text = vm.infoReport.fecha_asignacion ? moment(vm.infoReport.fecha_asignacion).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de Asignación';
                                        vm.reportToPDF.content.push(vm.generalData.DATE_REQUEST_ASSIGNEMENT);

                                        //Operador Ternario para asignar el inicio atención
                                        vm.generalData.DATE_ATTENTION.columns[0].columns[1].text = vm.infoReport.fecha_inicio_servicio ? moment(vm.infoReport.fecha_inicio_servicio).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de inicio de servicio';
                                        //Operador Ternario para asignar el fin atención
                                        vm.generalData.DATE_ATTENTION.columns[1].columns[1].text = vm.infoReport.fecha_fin_servicio ? moment(vm.infoReport.fecha_fin_servicio).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de fin de servicio';
                                        vm.reportToPDF.content.push(vm.generalData.DATE_ATTENTION);


                                        //Operador Ternario para asignar el kilometraje
                                        vm.generalData.KILOMETERS_SCORE.columns[0].columns[1].text = vm.infoReport.km !== null ? vm.infoReport.km : 'Sin kilometraje registrado';
                                        var iterator, califStar = '';
                                        for (iterator = 0; i < vm.infoReport.calificacion; i++) {
                                            califStar = califStar.concat("*");
                                        }
                                        //Operador Ternario para asignar la calificación
                                        vm.generalData.KILOMETERS_SCORE.columns[1].columns[1].text = vm.infoReport.fecha_fin_servicio > 0 ? califStar : 'Sin Calificación';
                                        vm.reportToPDF.content.push(vm.generalData.KILOMETERS_SCORE);
                                        vm.reportToPDF.content.push(vm.generalData.DOUBLE_BLANK);

                                        $http.get('app/mainApp/service/external/atenciones/report/report_store.json')
                                            .then(function (storeInfo) {
                                                vm.storeInfo = storeInfo.data;
                                                vm.reportToPDF.content.push(vm.storeInfo.BLANK_SPACE);
                                                vm.reportToPDF.content.push(vm.storeInfo.TITLE_STORE);
                                                vm.reportToPDF.content.push(vm.storeInfo.BLANK_SPACE);

                                                console.log(vm.infoReport.establecimiento)
                                                if (vm.infoReport.establecimiento==undefined) {
                                                    vm.reportToPDF.content.push(vm.storeInfo.NO_STORE);
                                                }
                                                else {
                                                    //Operador Ternario para asignar nombre de Establecimiento
                                                    vm.storeInfo.STORE_NAME.columns[1].text = vm.infoReport.establecimiento.nombre_establecimiento ? vm.infoReport.establecimiento.nombre_establecimiento : 'Sin Establecimiento';
                                                    vm.reportToPDF.content.push(vm.storeInfo.STORE_NAME);

                                                    //Operador Ternario para asignar nombre de Encargado
                                                    vm.storeInfo.ENCARGADO.columns[1].text = vm.infoReport.establecimiento.nombre_encargado ? vm.infoReport.establecimiento.nombre_encargado : 'Sin Encargado Registrado';
                                                    vm.reportToPDF.content.push(vm.storeInfo.ENCARGADO);

                                                    //Operador Ternario para asignar el Telefono del Establecimiento
                                                    vm.storeInfo.TELEPHONE_STATE.columns[0].columns[1].text = vm.infoReport.establecimiento.telefono_encargado ? vm.infoReport.establecimiento.telefono_encargado : 'Telefono no Registrado';
                                                    //Operador Ternario para asignar el Estado
                                                    vm.storeInfo.TELEPHONE_STATE.columns[1].columns[1].text = vm.infoReport.establecimiento.estado ? vm.infoReport.establecimiento.estado : 'Sin Estado';
                                                    vm.reportToPDF.content.push(vm.storeInfo.TELEPHONE_STATE);

                                                    //Operador Ternario para asignar  el Municipio
                                                    vm.storeInfo.CITY_LOCALITY.columns[0].columns[1].text = vm.infoReport.establecimiento.municipio ? vm.infoReport.establecimiento.municipio : 'Sin Municipio';
                                                    //Operador Ternario para asignar la localidad
                                                    vm.storeInfo.CITY_LOCALITY.columns[1].columns[1].text = vm.infoReport.establecimiento.localidad ? vm.infoReport.establecimiento.localidad : 'Sin Localidad';
                                                    vm.reportToPDF.content.push(vm.storeInfo.CITY_LOCALITY);

                                                    //Operador Ternario para asignar  la calle
                                                    vm.storeInfo.STREET_NUMBERSTREET.columns[0].columns[1].text = vm.infoReport.establecimiento.calle ? vm.infoReport.establecimiento.calle : 'Sin Calle';
                                                    //Operador Ternario para asignar el número de vivienda
                                                    vm.storeInfo.STREET_NUMBERSTREET.columns[1].columns[1].text = vm.infoReport.establecimiento.numero ? vm.infoReport.establecimiento.numero : 'Sin Número';
                                                    vm.reportToPDF.content.push(vm.storeInfo.STREET_NUMBERSTREET);

                                                    //Operador Ternario para asignar  entre calle
                                                    vm.storeInfo.NEXT_NEAR_STREET.columns[0].columns[1].text = vm.infoReport.establecimiento.entre_calle1 ? vm.infoReport.establecimiento.entre_calle1 : 'Entre Calle';
                                                    //Operador Ternario para asignar y calle
                                                    vm.storeInfo.NEXT_NEAR_STREET.columns[1].columns[1].text = vm.infoReport.establecimiento.entre_calle2 ? vm.infoReport.establecimiento.entre_calle2 : 'Entre Número';
                                                    vm.reportToPDF.content.push(vm.storeInfo.NEXT_NEAR_STREET);


                                                    //Operador Ternario para asignar  el codigo postal
                                                    vm.storeInfo.ZIPCODE_CABINET.columns[0].columns[1].text = vm.infoReport.establecimiento.cp ? vm.infoReport.establecimiento.cp : 'Sin Codigo Postal';
                                                    //Operador Ternario para asignar el cabinet
                                                    vm.storeInfo.ZIPCODE_CABINET.columns[1].columns[1].text = vm.infoReport.cabinet.economico ?  vm.infoReport.cabinet.economico: 'Sin Economico';
                                                    vm.reportToPDF.content.push(vm.storeInfo.ZIPCODE_CABINET);


                                                }
                                                vm.reportToPDF.content.push(vm.storeInfo.DOUBLE_BLANK);
                                                $http.get('app/mainApp/service/external/atenciones/report/report.cabinet.json')
                                                    .then(function (cabinet) {
                                                        vm.cabinetInfo = cabinet.data;
                                                        vm.reportToPDF.content.push(vm.cabinetInfo.BLANK_SPACE);
                                                        vm.reportToPDF.content.push(vm.cabinetInfo.CABINET_TITLE);
                                                        vm.reportToPDF.content.push(vm.cabinetInfo.BLANK_SPACE);
                                                        //console.log(vm.infoReport.cabinet);
                                                        if (vm.infoReport.cabinet==undefined) {
                                                            vm.reportToPDF.content.push(vm.cabinetInfo.NO_CABINET);
                                                        }
                                                        else {

                                                            //Operador Ternario para asignar  el economico del cabinet
                                                            vm.cabinetInfo.IDENTIFIER_INVENTORY_NUMBER.columns[0].columns[1].text =vm.infoReport.cabinet.economico  ? vm.infoReport.cabinet.economico : 'Sin Economico';
                                                            //Operador Ternario para asignar el numero de activo del cabinet
                                                            vm.cabinetInfo.IDENTIFIER_INVENTORY_NUMBER.columns[1].columns[1].text = vm.infoReport.cabinet.activo_id ?  vm.infoReport.cabinet.economico: 'Sin número de Activo';
                                                            vm.reportToPDF.content.push(vm.cabinetInfo.IDENTIFIER_INVENTORY_NUMBER);

                                                            //Operador Ternario para asignar  el modelo del cabinet
                                                            vm.cabinetInfo.MODEL_LEVEL_ANTIQUE.columns[0].columns[1].text =vm.infoReport.cabinet.modelo.nombre  ? vm.infoReport.cabinet.modelo.nombre : 'Sin Modelo';
                                                            //Operador Ternario para asignar la antiguedad del cabinet
                                                            vm.cabinetInfo.MODEL_LEVEL_ANTIQUE.columns[1].columns[1].text = vm.infoReport.cabinet.antiguedad ?  vm.infoReport.cabinet.antiguedad: 'Sin Antigüedad';
                                                            vm.reportToPDF.content.push(vm.cabinetInfo.MODEL_LEVEL_ANTIQUE);

                                                            //Operador Ternario para asignar  el modelo del cabinet
                                                            vm.cabinetInfo.INCIDENCES_SERIAL_NUMBER.columns[0].columns[1].text =vm.infoReport.cabinet.no_incidencias  ? vm.infoReport.cabinet.no_incidencias : 'Sin Incidencias';
                                                            //Operador Ternario para asignar la antiguedad del cabinet
                                                            vm.cabinetInfo.INCIDENCES_SERIAL_NUMBER.columns[1].columns[1].text = vm.infoReport.cabinet.no_serie ?  vm.infoReport.cabinet.no_serie: 'Sin No. de Serie';
                                                            vm.reportToPDF.content.push(vm.cabinetInfo.INCIDENCES_SERIAL_NUMBER);

                                                        }
                                                        $http.get('app/mainApp/service/external/atenciones/report/report_work_notes.json')
                                                            .then(function (worknotes) {
                                                                vm.worknotes = worknotes.data;
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                vm.reportToPDF.content.push(vm.worknotes.REPORT_WORK_TITLE);
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);

                                                                //Descripción de Trabajo

                                                                vm.reportToPDF.content.push(vm.worknotes.WORK_DESCRIPTION_JOB);
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                //operador ternario para asignar la descripción del trabajo
                                                                vm.worknotes.WORK_DESCRIPTION.text= vm.infoReport.descripcion_trabajo ? vm.infoReport.descripcion_trabajo : 'Sin Notas de Trabajo';
                                                                vm.reportToPDF.content.push(vm.worknotes.WORK_DESCRIPTION);

                                                                //Observaciones Tecnicas
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                vm.reportToPDF.content.push(vm.worknotes.TECHNICAL_OBSERVATION_TITLE);
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                //operador ternario para asignar la descripción del trabajo
                                                                vm.worknotes.TECHNICAL_OBSERVATION.text= vm.infoReport.observaciones_tecnico ? vm.infoReport.observaciones_tecnico : 'Sin Observaciones del Tecnico';
                                                                vm.reportToPDF.content.push(vm.worknotes.TECHNICAL_OBSERVATION);

                                                                //Observaciones Cliente
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                vm.reportToPDF.content.push(vm.worknotes.CLIENT_OBSERVATION_TITLE);
                                                                vm.reportToPDF.content.push(vm.worknotes.BLANK_SPACE);
                                                                //operador ternario para asignar la descripción del trabajo
                                                                vm.worknotes.CLIENT_OBSERVATION.text= vm.infoReport.observaciones_cliente ? vm.infoReport.observaciones_cliente : 'Sin Observaciones del Cliente';
                                                                vm.reportToPDF.content.push(vm.worknotes.CLIENT_OBSERVATION);

                                                                vm.reportToPDF.content.push(vm.worknotes.DOUBLE_BLANK_SPACE);




                                                                pdfMake.createPdf(vm.reportToPDF).download("Reporte-atencion-" + vm.infoReport.folio.toString() + ".pdf");
                                                            });
                                                    });

                                            });


                                    });

                                //Debe ser la ultima función a ejecutarse


                            });


                    }).catch(function (JSONError) {
                    $log.error(JSONError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.JSON_REPORT_ERROR'));
                });
            });
        }


    }
})();
