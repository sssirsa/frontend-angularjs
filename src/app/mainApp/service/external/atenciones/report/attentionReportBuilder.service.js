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
            vm.reportToPDF={
                content:[],
                styles:{}
            };
            vm.reportToPDF.content=[];
            var getInfopromise = atencionPV.getReport(id);
            getInfopromise.then(function (respuesta) {
                vm.infoReport = respuesta;

                $http.get('app/mainApp/service/external/atenciones/report/report.json')
                    .then(function (reporteToPDF) {
                        vm.reportToPDF = reporteToPDF.data;
                        $log.info(vm.reportToPDF);
                        $http.get('app/mainApp/service/external/atenciones/report/report.header.json')
                            .then(function (cabecera) {
                                vm.cabecera={};
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

                                        vm.generalData.DATE_REQUEST_ASSIGNEMENT.columns[0].columns[1].text = vm.infoReport.fecha  ?  moment(vm.infoReport.fecha).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de Solicitud';
                                        //Operador Ternario para asignar la fecha de asignación
                                        vm.generalData.DATE_REQUEST_ASSIGNEMENT.columns[1].columns[1].text = vm.infoReport.fecha_asignacion  ? moment(vm.infoReport.fecha_asignacion).format('MMMM Do YYYY, h:mm:ss a')  : 'Sin fecha de Asignación';
                                        vm.reportToPDF.content.push(vm.generalData.DATE_REQUEST_ASSIGNEMENT);

                                        //Operador Ternario para asignar el inicio atención
                                        vm.generalData.DATE_ATTENTION.columns[0].columns[1].text = vm.infoReport.fecha_inicio_servicio  ?  moment(vm.infoReport.fecha_inicio_servicio).format('MMMM Do YYYY, h:mm:ss a') : 'Sin fecha de inicio de servicio';
                                        //Operador Ternario para asignar el fin atención
                                        vm.generalData.DATE_ATTENTION.columns[1].columns[1].text = vm.infoReport.fecha_fin_servicio ?  moment(vm.infoReport.fecha_fin_servicio).format('MMMM Do YYYY, h:mm:ss a')  : 'Sin fecha de fin de servicio';
                                        vm.reportToPDF.content.push(vm.generalData.DATE_ATTENTION);


                                        //Operador Ternario para asignar el kilometraje
                                        vm.generalData.KILOMETERS_SCORE.columns[0].columns[1].text = vm.infoReport.km !== null ? vm.infoReport.km : 'Sin kilometraje registrado';
                                        var iterator, califStar='';
                                        for(iterator=0; i<vm.infoReport.calificacion;i++){
                                            califStar=califStar.concat("*");
                                        }
                                        //Operador Ternario para asignar la calificación
                                        vm.generalData.KILOMETERS_SCORE.columns[1].columns[1].text = vm.infoReport.fecha_fin_servicio >0 ? califStar : 'Sin Calificación';
                                        vm.reportToPDF.content.push(vm.generalData.KILOMETERS_SCORE);
                                        vm.reportToPDF.content.push(vm.generalData.DOUBLE_BLANK);

                                        pdfMake.createPdf(vm.reportToPDF).download("Reporte-atencion-" + vm.infoReport.folio.toString() + ".pdf");
                                        $http.get('app/mainApp/service/external/atenciones/report/report.general_data.json')
                                            .then(function (generalData) {


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
