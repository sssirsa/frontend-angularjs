(function () {
    angular
        .module('app.mainApp')
        .constant('OPTIONS', {
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
            salePointAssignKind: [
                { id: 'pending', value: 'Pendientes' },
                { id: 'all', value: 'Detalle de atención' }
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
            //New module separation
            //Note: if a new module constant is registered,
            //then it must be added trough the mainApp config file.
            com: {},
            entries_departures: {}, //Added at config file
            geoLocation: 'https://www.google.com/maps/search/?api=1&query=',
            inventory: {}, //Added at config file
            management: {}, //Added at config file
            salepoint: {},//Added at config file
            technical_service: {}, //Added at config file

            //TODO: Re group under the proper category
            //When done, delete all below this line
            estado: 'estado',
            localidad: 'localidad',
            municipio: 'municipio',
            segmentation: 'segmentacion',
            solicitud_pv: 'solicitud',
            atencion_pv: 'atencion_pv',
            grupo_persona: 'grupo_persona',
            group_employee: 'grupo',
            preRequest: 'pre_solicitud',
            establecimiento: 'establecimiento',
            establecimiento_template: 'https://goo.gl/kAQrxt',
            massive: {
                store: 'massive/store'
            },
            credentials: 'credenciales',
            map: 'https://maps.googleapis.com/maps/api/staticmap',
            tecnicosDisponibles: 'employees'
            //report_builder: 'report_builder', //TODO: Plata, esto te toca arreglarlo a tí
            //reporte_insumos: 'reports/insumos',

        })
        .constant('QUERIES', {
            cabinet: {
                by_brand: '?marca__id='
            },
            city: {
                by_state: '?estado__id='
            },
            locality: {
                by_state: '?municipio__estado__id=',
                by_city: '?municipio__id='
            },
            store: {
                by_state: '?localidad__municipio__estado_id=',
                by_city: '?localidad__municipio_id=',
                by_locality: '?localidad_id=',
                by_postal_code: '?localidad__codigo_postal=',
                by_economic: '/lookup/'
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
        .constant('KEYS', {
            MAPS_KEY: 'AIzaSyC0oEOvB5sbNFJDRHF_2xbp6JBnwQPM3zA'
        })
        .constant('PAGINATION', {
            total: 'count',
            next: 'next',
            previous: 'previous',
            elements: 'results'
        });
}) ();
