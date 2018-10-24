(function () {
    angular
        .module('app')
        .constant('EVENTS_GENERAL', {
            notFound: 'not-found',
            notFount_select: 'not-found-select',
            load_fields: 'load-data-fields',
            bind_channels: 'bind-channels'
        })
        .constant('OPTIONS', {
            status: [
                {
                    id: 0,
                    value: "No Confirmada"
                },
                {
                    id: 1,
                    value: "Confirmada"
                },
                {
                    id: 2,
                    value: "Cancelada"
                },
                {
                    id: 3,
                    value: "Cerrada"
                }
            ],
            type_request: [
                {
                    id: 0,
                    value: "Solicitud de envío",
                    value_id: "Envio"
                },
                {
                    id: 1,
                    value: "Solicitud de recolección",
                    value_id: "Recoleccion"
                },
                {
                    id: 2,
                    value: "Solicitud de punto de venta"
                }
            ],
            status_equipment: [
                {
                    id: 0,
                    value: "Nuevo"
                },
                {
                    id: 1,
                    value: "Reparado"
                }
            ],
            tipoSolicitud: [
                {
                    id: 0,
                    name: "Solicitud de envió",
                    value: "Envio"
                },
                {
                    id: 1,
                    name: "Solicitud de recolección",
                    value: "Recoleccion"
                },
                {
                    id: 2,
                    name: "Solicitud de punto de venta",
                    value: "Venta"
                }
            ],
            filtrarSolicitud: [
                {

                    name: "Todas las solicitudes de esté tipo",
                    value: "Todas"
                },
                {

                    name: "Por Folio",
                    value: "Por Folio"
                },
                {
                    name: "Por Estatus",
                    value: "Por Estatus"
                }
            ],
            estatusSol: [
                {
                    name: "Confirmada",
                    value: "Confirmada"
                },
                {
                    name: "No Confirmada",
                    value: "No Confirmada"
                },
                {
                    name: "Cancelada",
                    value: "Cancelada"
                },
                {
                    name: "Cerrada",
                    value: "Cerrada"
                }
            ],
            steps: [{
                nombre: 'Depuración',
                value: 'E1'
            }, {
                nombre: 'Diagnostico',
                value: 'E2'
            }, {
                nombre: 'Armado y Reparación',
                value: 'E3'
            }, {
                nombre: 'Limpieza',
                value: 'E3.1'
            }, {
                nombre: 'Armado',
                value: 'E3.2'
            }, {
                nombre: 'Vacío y Carga de Gas',
                value: 'E3.3'
            }, {
                nombre: 'Terminado',
                value: 'E4'
            }, {
                nombre: 'Bodega',
                value: 'E5'
            }, {
                nombre: 'Carritos y Bicicletas',
                value: 'E6'
            }, {
                nombre: 'Servicio en Punto de Venta',
                value: 'E7'
            }, {
                nombre: 'Confinamiento',
                value: 'EC'
            }, {
                nombre: 'Destrucción',
                value: 'ED'
            }],
            antiguedad: [
                { id: 'A', value: 'A' },
                { id: 'B', value: 'B' },
                { id: 'C', value: 'C' },
                { id: 'D', value: 'D' },
                { id: 'E', value: 'E' },
                { id: 'F', value: 'F' }
            ],
            estatus_cabinet: [
                { display: 'Reparación Mayor', value: 'Reparacion Mayor' },
                { display: 'Sistema Tapado', value: 'Sistema Tapado' },
                { display: 'Reparación Media', value: 'Reparacion Media' },
                { display: 'Reparación Menor', value: 'Reparacion Menor' },
                { display: 'Fuga Interna', value: 'Fuga Interna' },
                { display: 'Obsoleto', value: 'Obsoleto' },
                { display: 'N/A', value: 'N/A' }
            ],
            type_out: [
                {
                    id: 0,
                    value: "Normal",
                    value_service: "normal"
                },
                {
                    id: 1,
                    value: "Nuevo",
                    value_service: "nuevos"
                },
                {
                    id: 2,
                    value: "Fuga Interna",
                    value_service: "fuga_interna"
                },
                {
                    id: 3,
                    value: "Obsoleto",
                    value_service: "obsoleto"
                }
            ],
            units: [
                {
                    id: "Kg",
                    value: "Kg"
                },
                {
                    id: "g",
                    value: "g"
                },
                {
                    id: "mg",
                    value: "mg"
                },
                {
                    id: "L",
                    value: "L"
                },
                {
                    id: "mL",
                    value: "mL"
                },
                {
                    id: "piezas",
                    value: "piezas"
                }],
            zone: [
                {
                    value: "Metro"
                },
                {
                    value: "Centro"
                },
                {
                    value: "Sur"
                },
                {
                    value: "Norte"
                },
                {
                    value: "Occidente"
                },
                {
                    value: "Oriente"
                },
                {
                    value: "Distribuidores"
                }
            ],
            filter: [
                { id: 'exact', value: "Igual" },
                { id: 'iexact', value: "Igual (Exacto)" },
                { id: 'contains', value: "Contiene" },
                { id: 'icontains', value: "Contine (Exacto)" },
                { id: 'in', value: "Lista de valores" },
                { id: 'gt', value: "Mayor que" },
                { id: 'gte', value: "Mayor igual que" },
                { id: 'lt', value: "Menor que" },
                { id: 'lte', value: "Menor igual que" },
                { id: 'startswith', value: "Comienza con" },
                { id: 'istartswith', value: "Comienza con (Exacto)" },
                { id: 'endswith', value: "Termina con" },
                { id: 'iendswith', value: "Termina con (Exacto)" },
                { id: 'range', value: "Rango de fecha" },
                { id: 'week_day', value: "Día de la semana" },
                { id: 'isnull', value: "Es vacio" },
                { id: 'max', value: "Máximo" },
                { id: 'min', value: "Mínimo" }
            ],
            filterInt: [
                { id: 'gt', value: "Mayor que" },
                { id: 'gte', value: "Mayor igual que" },
                { id: 'lt', value: "Menor que" },
                { id: 'lte', value: "Menor igual que" },
                { id: 'exact', value: "Igual" },
                { id: 'iexact', value: "Igual (Exacto)" }
            ],
            filterChar: [
                { id: 'exact', value: "Igual" },
                { id: 'iexact', value: "Igual (Exacto)" },
                { id: 'contains', value: "Contiene" },
                { id: 'icontains', value: "Contine (Exacto)" },
                { id: 'in', value: "Lista de valores" },
                { id: 'startswith', value: "Comienza con" },
                { id: 'istartswith', value: "Comienza con (Exacto)" },
                { id: 'endswith', value: "Termina con" },
                { id: 'iendswith', value: "Termina con (Exacto)" },
                { id: 'isnull', value: "Es vacio" }
            ],
            filterDate: [
                { id: 'range', value: "Rango de fecha" },
                { id: 'week_day', value: "Día de la semana" },
                { id: 'isnull', value: "Es vacio" }
            ],
            days: [
                { id: 2, value: "Lunes" },
                { id: 3, value: "Martes" },
                { id: 4, value: "Miércoles" },
                { id: 5, value: "Jueves" },
                { id: 6, value: "Viernes" },
                { id: 7, value: "Sábado" },
                { id: 1, value: "Domingo" }
            ],
            formats: [
                { value: "xlsx" },
                { value: "csv" }
            ],
            types: [
                {
                    id: 'CharField',
                    text: 'Texto'
                },
                {
                    id: 'TextField',
                    text: 'Texto'
                },
                {
                    id: 'DateTimeField',
                    text: 'Fecha y Hora'
                },
                {
                    id: 'DateField',
                    text: 'Fecha'
                },
                {
                    id: 'AutoField',
                    text: 'Auto Incremento'
                },
                {
                    id: 'FileField',
                    text: 'Archivo'
                },
                {
                    id: 'ImageField',
                    text: 'Imagen'
                },
                {
                    id: 'BooleanField',
                    text: 'Booleano'
                },
                {
                    id: 'ArrayField',
                    text: 'Multiple'
                },
                {
                    id: 'IntegerField',
                    text: 'Entero'
                },
                {
                    id: 'DecimalField',
                    text: 'Decimal'
                }],
            field_types: [
                {
                    id: "",
                    text: "Normal"
                },
                {
                    id: "Sum",
                    text: "Suma"
                },
                {
                    id: "Count",
                    text: "Contar"
                },
                {
                    id: "Avg",
                    text: "Promedio"
                },
                {
                    id: "Max",
                    text: "Máximo"
                },
                {
                    id: "Min",
                    text: "Minimo"
                }
            ],
            input_types: [
                {
                    id: "Nuevo",
                    text: "Nuevos"
                },
                {
                    id: "Garantia",
                    text: "Garantias"
                }
            ],
            fieldServiceTypes: [
                {
                    id: "all",
                    text: "Todos"
                },
                {
                    id: "open",
                    text: "Abiertos"
                },
                {
                    id: "close",
                    text: "Cerrados"
                }
            ],
            jobKinds: [
                { value: 'Mayor' },
                { value: 'Medio' },
                { value: 'Menor' },
                { value: 'Cambio de Equipo' },
                { value: 'Entrega de equipo' },
                { value: 'Retiro de equipo' },
                { value: 'Otro' }

            ],
            salePointAssignKind: [
                {id: 'pending', value: 'Pendientes'},
                {id: 'all', value: 'Detalle de atención'}
            ],
            requestKinds: [
                {
                    id: 'Nuevos',
                    label: 'Nuevos'
                },
                {
                    id: 'Incremental',
                    label: 'Incremental'
                },
                {
                    id: 'Recolección',
                    label: 'Retiro'
                },
                {
                    id: 'Cambio',
                    label: 'Cambio'
                },
                {
                    id: 'Servicio Técnico',
                    label: 'Servicio técnico'
                }
            ]
        })
        .constant('URLS', {
            geoLocation: 'https://www.google.com/maps/search/?api=1&query=',
            condicion: 'condition',
            estatus_unilever: 'status_unilever',
            estatus_com: 'status_com',
            cabinet_pv: 'cabinet_pv',
            cabinet: 'cabinet',
            cabinets: 'cabinets',
            cabinet_clean: 'cabinet_clean',
            cabinet_entrada: 'cabinet_input',
            cabinet_entrada_salida: 'cabinet_entrada_salida',
            catalogo_insumos: 'catalogo_insumos',
            categoria: 'categoria',
            checklist: 'CheckList',
            cliente: 'persona_capturista',
            cliente_grupos: 'cliente_groups',
            diagnostico: 'diagnostico',
            diagnostico_cabinet: 'diagnostico_cabinet',
            entrada_salida: 'entrada_salida',
            salida: 'exit',
            remision: 'remision',
            normalize_cabinets: 'normalize',
            entrada_masiva: 'mass_upload',
            salida_masiva: 'mass_exit',
            udn: 'udn',
            etapa: 'etapa',
            grupos: 'groups',
            insumo: 'insumo',
            linea_transporte: 'linea_transporte',
            localidad: 'localidad',
            marca: 'marca_cabinet',
            persona: 'persona',
            persona_admin: 'persona_admin',
            tecnicosDisponibles: 'employees',
            proveedor: 'proveedor',
            proyecto: 'proyecto',
            report_builder: 'report_builder',
            reporte_insumos: 'reports/insumos',
            rutas: 'ruta',
            solicitud_pv: 'solicitud',
            atencion_pv: 'atencion_pv',
            etapa_servicio: 'etapa_servicio',
            insumo_usado: 'insumo_usado',
            grupo_persona: 'grupo_persona',
            group_employee: 'grupo',
            solicitudes: {
                admin: 'solicitud_admin',
                servicio: 'solicitud_servicio',
                servicio_admin: 'solicitud_servicio_admin'
            },
            preRequest: 'pre_solicitud',
            requestClient: 'technical_request',
            establecimiento: 'establecimiento',
            establecimiento_template: 'https://goo.gl/kAQrxt',
            sucursal: 'sucursal',
            tipo_equipo: 'tipo_equipo',
            tipo_transporte: 'tipo_transporte',
            unidad: 'unidad',
            modelo_cabinet: 'modelo_cabinet',
            estado: 'estado',
            municipio: 'municipio',
            massive: {
                store: 'massive/store'
            },
            segmentation: 'segmentacion',
            credentials: 'credenciales',
            map: 'https://maps.googleapis.com/maps/api/staticmap'
        })
        .constant('QUERIES', {
            store: {
                by_state: '?localidad__municipio__estado_id=',
                by_city: '?localidad__municipio_id=',
                by_locality: '?localidad_id=',
                by_postal_code: '?localidad__codigo_postal=',
                by_economic: '/lookup/'
            },
            city: {
                by_state: '?estado__id='
            },
            locality: {
                by_state: '?municipio__estado__id=',
                by_city: '?municipio__id='
            }
        })
        .constant('CONFIGS', {
            ADTConfig: {
                calType: 'gregorian',
                dtpType: 'date',
                format: 'DD/MM/YYYY',
                default: 'today',
                autoClose: true,
                multiple: false,
                todayStr: 'Hoy',
                hideTimeSelector: true,
                position: 'top',
                isReadOnly: true,
                daysNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                monthsNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            ADTConfigBottom: {
                calType: 'gregorian',
                dtpType: 'date',
                format: 'DD/MM/YYYY',
                default: 'today',
                autoClose: true,
                multiple: false,
                todayStr: 'Hoy',
                hideTimeSelector: true,
                position: 'Bottom',
                isReadOnly: true,
                daysNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                monthsNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            ADTConfigTime: {
                calType: 'gregorian',
                dtpType: 'date&time',
                format: 'DD/MM/YYYY hh:mm',
                default: 'today',
                autoClose: true,
                multiple: false,
                isReadOnly: true,
                todayStr: 'Hoy',
                position: 'top',
                daysNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                monthsNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            }
        })
        .constant('SCORES',
            [
                {
                    value: 0,
                    label: '☆☆☆☆☆'
                },
                {
                    value: 1,
                    label: '★☆☆☆☆'
                },
                {
                    value: 2,
                    label: '★★☆☆☆'
                },
                {
                    value: 3,
                    label: '★★★☆☆'
                },
                {
                    value: 4,
                    label: '★★★★☆'
                },
                {
                    value: 5,
                    label: '★★★★★'
                }]
        )
        .constant('STORE_SEGMENTATION',
            [
                {
                    value: 5,
                    label: 'Platino',
                    class: 'store_platinum'
                },
                {
                    value: 4,
                    label: 'Oro',
                    class: 'store_gold'
                },
                {
                    value: 3,
                    label: 'Plata',
                    class: 'store_silver'
                },
                {
                    value: 2,
                    label: 'Bronce',
                    class: 'store_bronze'
                },
                {
                    value: 1,
                    label: 'Bajo Bronce',
                    class: 'store_low_bronze'
                },
                {
                    value: 0,
                    label: 'Rojo',
                    class: 'store_red'
                }]
        )
        .constant('KEYS', {
            MAPS_KEY: 'AIzaSyC0oEOvB5sbNFJDRHF_2xbp6JBnwQPM3zA'
        })
        .constant('PAGINATION', {
            total: 'count',
            next: 'next',
            previous: 'previous',
            elements: 'results'
        })
        .constant('MANAGEMENT',{
            uri: 'http://api-gateway.sssirsa.com/management-dev/catalogue/'
        });
})();
