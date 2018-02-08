(function () {
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('ListRequestPageController', ListRequestPageController);

    /* @ngInject */
    function ListRequestPageController($state, $log, toastr, SalePointRequests, Translate, $http, Solicitudes) {
        var vm = this;

        //Function mapping
        vm.listRequests = listRequests;
        vm.selectRequest = selectRequest;
        vm.downloadReport = downloadReport;

        //Variable declaration
        vm.selectedKind = null;
        vm.allRequests = null;

        activate();

        function activate() {
            vm.loadingPromise = SalePointRequests.getAll()
                .then(function (listRequestsSuccess) {
                    vm.allRequests = listRequestsSuccess;
                    vm.requests = vm.allRequests;
                })
                .catch(function (listRequestsError) {
                    $log.error(listRequestsError);
                    toastr.error(Translate.translate('REQUESTS.LIST.TOASTR.ERROR'));
                });
        }

        function listRequests(requestKind) {
            if (requestKind !== 'Todo') {
                vm.requests = _.where(vm.allRequests, {status: requestKind});
            }
            else {
                vm.requests = vm.allRequests;
            }
        }

        function selectRequest(request) {
            $state.go('triangular.admin-default.detailRequest', {id: request.id});
        }

        function downloadReport(requestID){

            $log.debug(JSON.stringify(
                {
                    styles:{
                        title:{
                            fontSize:30,
                            bold:true,
                            italics:true,
                            alignment:'center'
                        },
                        mid_title:{
                            fontSize:20,
                            bold:true,
                            italics:true,
                            alignment:'center',
                            margin:[0,20,0,10]
                        },
                        subtitle:{
                            fontSize:12,
                            bold:true,
                            italics:true,
                            alignment:'center'
                        },
                        data_label:{
                            fontSize:14,
                            bold:true,
                            italics:true,
                            alignment:'left'
                        },
                        header:{
                            margin:[10,10,10,20]
                        },
                        filler:{
                            margin:[0,0,0,100]
                        }
                    },
                    content: [
                        {
                            style:'header',
                            columns:[
                                {
                                    image: "data:image/png;base64,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",
                                    width: 100
                                },
                                {
                                    stack:[
                                        {
                                            text:'SSSIR S.A. de C.V.',
                                            style:'title'
                                        },
                                        {
                                            text:'Solid Solutions Servicios Integrales en Refrigeración S.A. de C.V.',
                                            style:'subtitle'
                                        },
                                        {
                                            style:'mid_title',
                                            text:'Reporte de '
                                        },
                                        {
                                            style:'mid_title',
                                            text:'folio'
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            style:'mid_title',
                            text:'Información de la'
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Status:'
                                        },
                                        {
                                            text:'Abierta'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Tipo:'
                                        },
                                        {
                                            text:'Nuevos'
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Atendió:'
                                        },
                                        {
                                            text:'Nombre de la persona que atendió la solicitud'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Fecha:'
                                        },
                                        {
                                            text:'dd/MM/aaaa hh:mm:ss'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Sucursal:'
                                        },
                                        {
                                            text:'Tenayuca'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Calificación:'
                                        },
                                        {
                                            text:'0'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            style:'mid_title',
                            text:'Información del establecimiento'
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Nombre del establecimiento'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Encargado:'
                                        },
                                        {
                                            text:'Nombre del encargado'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Teléfono:'
                                        },
                                        {
                                            text:'1234567890'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Calle:'
                                        },
                                        {
                                            text:'Nombre de la calle'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Número:'
                                        },
                                        {
                                            text:'SN'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Entre calle:'
                                        },
                                        {
                                            text:'Entre calle 1'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Y entre calle:'
                                        },
                                        {
                                            text:'Entre calle 2'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Estado:'
                                        },
                                        {
                                            text:'Nombre del estado'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Municipio:'
                                        },
                                        {
                                            text:'Nombre del municipio'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            stack:[
                                {
                                    columns:[
                                        {
                                            style:'data_label',
                                            text:'Localidad:'
                                        },
                                        {
                                            text:'Nombre de la localidad'
                                        },
                                        {
                                            style:'data_label',
                                            text:'Código postal:'
                                        },
                                        {
                                            text:'00000'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            style:'mid_title',
                            text:'Observaciones'
                        },
                        {
                            columns:[
                                {
                                    stack:[
                                        {
                                            style:'data_label',
                                            text:'Observaciones técnicas:'
                                        },
                                        {
                                            text:''
                                        }
                                    ]
                                },
                                {
                                    stack:[
                                        {
                                            style:'data_label',
                                            text:'Observaciones del cliente:'
                                        },
                                        {
                                            text:''
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            text:'\n'
                        },
                        {
                            columns:[
                                {
                                    stack:[
                                        {
                                            style:'data_label',
                                            text:'Firma del trabajador'
                                        },
                                        {
                                            image: "",
                                            width: 100,
                                            alignment:'center'
                                        }
                                    ]
                                },
                                {
                                    stack:[
                                        {
                                            style:'data_label',
                                            text:'Firma del cliente:'
                                        },
                                        {
                                            image: "",
                                            width: 100,
                                            alignment:'center'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            style:'filler',
                            text:' '
                        }
                    ]
                }

            ));

            $http.get('app/mainApp/servicios/solicitudes/report/formato.json')
                .success(function(formato){
                    $log.debug(formato);
                    Solicitudes.report(requestID)
                        .then(function(reporte){
                            $log.debug(reporte);
                            //Encabezado
                            //Titulo
                            formato.content[0].columns[1].stack[2].text='Reporte de Solicitud';
                            //Folio de la solicitud
                            formato.content[0].columns[1].stack[3].text=reporte.id;
                            //Información de la solicitud
                            //Titulo
                            formato.content[1].text = 'Información de la solicitud'
                            //Estatus
                            formato.content[2].stack[0].columns[1].text=reporte.status;
                            //Tipo
                            formato.content[2].stack[0].columns[3].text=reporte.tipo;
                            //Atendió
                            formato.content[3].stack[0].columns[1].text=reporte.persona;
                            //Fecha
                            formato.content[3].stack[0].columns[3].text=moment(reporte.fecha, 'DD/MM/YYYY HH:mm:SS');
                            //Sucursal
                            formato.content[4].stack[0].columns[1].text=reporte.sucursal;
                            //Calificación
                            formato.content[4].stack[0].columns[3].text=reporte.calificacion;
                            //Información del establecimiento
                            //Nombre establecimiento
                            formato.content[6].stack[0].columns[0].text = reporte.establecimiento.nombre_establecimiento;
                            //Encargado
                            formato.content[7].stack[0].columns[1].text = reporte.establecimiento.nombre_encargado;
                            //Teléfono
                            formato.content[7].stack[0].columns[3].text = reporte.establecimiento.telefono_encargado;
                            //Calle
                            formato.content[8].stack[0].columns[1].text = reporte.establecimiento.calle;
                            //Número
                            formato.content[8].stack[0].columns[3].text = reporte.establecimiento.numero;
                            //Entre calle 1
                            formato.content[9].stack[0].columns[1].text = reporte.establecimiento.entre_calle1;
                            //Entre call2 2
                            formato.content[9].stack[0].columns[3].text = reporte.establecimiento.entre_calle2;
                            //Estado
                            formato.content[10].stack[0].columns[1].text = reporte.establecimiento.estado;
                            //Municipio
                            formato.content[10].stack[0].columns[3].text = reporte.establecimiento.municipio;
                            //Localidad
                            formato.content[10].stack[0].columns[1].text = reporte.establecimiento.localidad;
                            //CP
                            formato.content[10].stack[0].columns[3].text = reporte.establecimiento.cp;
                            //Observaciones
                            //Técnicas
                            formato.content[12].columns[0].stack[1].text = reporte.observaciones_tecnico;
                            //Cliente
                            formato.content[12].columns[1].stack[1].text = reporte.observaciones_cliente;
                            //Firmas
                            //Trabajador
                            formato.content[14].columns[0].stack[1].image = 'data:image/png;base64,'+reporte.firma_prospectador;
                            //Cliente
                            formato.content[14].columns[1].stack[1].image = 'data:image/png;base64,'+reporte.firma_prospectador;

                            //Evidencias
                            reporte.evidencia.forEach(function(evidence){
                                var image = {
                                    image:'data:image/png;base64,'+evidence.foto,
                                    width: 500,
                                    alignment:'center'
                                };
                                formato.content.push(image);
                            });
                            $log.debug(formato);
                            //Generación del PDF
                            //pdfMake.createPdf(formato).download("Reporte-Solicitud-" + reporte.id.toString() + ".pdf");

                        })
                        .catch(function(reporteError){
                            //TODO:Error handling
                            $log.error(reporteError);
                        });
                })
                .catch(function(JSONError){
                    $log.error(JSONError);
                });
        }

    }
})();
