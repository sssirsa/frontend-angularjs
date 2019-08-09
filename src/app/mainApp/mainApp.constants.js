(function () {
    angular
        .module('app.mainApp')
        .constant('OPTIONS', {
            salePointAssignKind: [
                { id: 'pending', value: 'Pendientes' },
                { id: 'all', value: 'Detalle de atención' }
            ],
            management: {
                catalogues: {
                    udn: {
                        zone: [
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
                                value: "Occidente (Oeste)"
                            },
                            {
                                value: "Oriente (Este)"
                            },
                            {
                                value: "Metropolitana"
                            }
                        ]
                    }
                }
            },
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
            ],
            technical_service: {
                presurize_options: [

                    {
                        name: "Corregida la fuga",
                        value: "Diagnostico"
                    },
                    {
                        name: "Necesario Obsoletizar",
                        value: "Obsoleto"
                    },
                    {
                        name: "Requiere una nueva Carga de Gas y reparación",
                        value: "Presurizado"
                    },
                    {
                        name: "Requiere una Revisión Posterior",
                        value: "Continuar"
                    }
                ]
            }
        })
        .constant('URLS', {
            //New module separation
            //Note: if a new module constant is registered,
            //then it must be added trough the mainApp config file.
            com: {}, //Add at config file
            entries_departures: {}, //Added at config file
            geoLocation: 'https://www.google.com/maps/search/?api=1&query=',
            inventory: {}, //Added at config file
            management: {}, //Added at config file
            salepoint: {},//Added at config file
            technical_service: {}, //Added at config file

            //TODO: Re group under the proper category
            //When done, delete all below this line
            solicitud_pv: 'solicitud',
            atencion_pv: 'atencion_pv',
            preRequest: 'pre_solicitud',
            establecimiento_template: 'https://goo.gl/kAQrxt',
            massive: {
                store: 'massive/store'
            },
            credentials: 'credenciales',
            map: 'https://maps.googleapis.com/maps/api/staticmap',
            report_builder: 'report_builder', //TODO: Plata, esto te toca arreglarlo a tí
            reporte_insumos: 'reports/insumos'

        })
        .constant('QUERIES', {
            cabinet: {
                by_brand: '?marca__id='
            },
            city: {
                by_state: 'estado__id'
            },
            locality: {
                by_state: 'municipio__estado__id',
                by_city: 'municipio__id',
                by_postal_code: 'codigo_postal'
            },
            service: {
                by_cabinet: 'cabinet__economico'
            },
            store: {
                by_state: 'localidad__municipio__estado__id',
                by_city: 'localidad__municipio__id',
                by_locality: 'localidad__id',
                by_postal_code: 'localidad__codigo_postal',
                by_economic: '/lookup/'
            },
            user: {
                by_existing_email: 'user__email__not',
                by_username: 'user__username',
                by_name: 'nombre',
                by_middlename: 'apellido_paterno',
                by_lastname:'apellido_materno'
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
            [{
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
        .constant('PAGINATION', {
            total: 'count',
            next: 'next',
            previous: 'previous',
            elements: 'results',
            limit: 'limit',
            offset: 'offset',
            pageSize: 20,
            mode: 'infinite'
        });
})();
