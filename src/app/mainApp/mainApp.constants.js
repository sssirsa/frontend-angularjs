(function () {
    angular
        .module('app.mainApp')
        .constant('OPTIONS', {
            entries_departures: {
                entries: {
                    addCabinetKind: [
                        {
                            value: 'No_esperado',
                            verbose: 'ENTRIES.DETAIL.DIALOGS.ADD_ASSET.STATUSES.NOT_EXPECTED'
                        },
                        {
                            value: 'Pendiente',
                            verbose: 'ENTRIES.DETAIL.DIALOGS.ADD_ASSET.STATUSES.PENDING'
                        }
                    ]
                }
            },
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
            map: 'https://maps.googleapis.com/maps/api/staticmap'

        })
        .constant('QUERIES', {
            cabinet: {
                by_brand: '?marca__id='
            },
            changes: {
                by_destination_agency: 'udn_destino__id',
                by_destination_subsidiary: 'sucursal_origen__id',
                by_origin_agency: 'udn_origen__id',
                by_origin_subsidiary: 'sucursal_origen__id'
            },
            city: {
                by_state: 'estado__id'
            },
            entries_departures: {
                by_agency: 'udn',
                by_subsidiary: 'sucursal',
                by_transport_line:'linea_transporte'
            },
            locality: {
                by_state: 'municipio__estado__id',
                by_city: 'municipio__id',
                by_postal_code: 'codigo_postal'
            },
            ordering: 'ordering',
            salepoint: {
                by_status: {
                    base: 'status',
                    assigned: 'Asignada',
                    cancelled: 'Cancelada',
                    closed: 'Atendida',
                    in_process: 'En_proceso',
                    open: 'Abierta',
                    unproductive: 'Improductiva'
                },
                by_user:'persona__id'
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
                by_lastname: 'apellido_materno'
            }
        })
        .constant('CONFIGS', {
            moment: {
                months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
                monthsShort: 'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.'.split('_'),
                monthsParseExact: true,
                weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
                weekdaysShort: 'Dom._Lun._Mar._Mie._Jue._Vie._Sab.'.split('_'),
                weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
                weekdaysParseExact: true,
                longDateFormat: {
                    LT: 'HH:mm',
                    LTS: 'HH:mm:ss',
                    L: 'DD/MM/YYYY',
                    LL: 'D MMMM YYYY',
                    LLL: 'D MMMM YYYY HH:mm',
                    LLLL: 'dddd D MMMM YYYY HH:mm'
                },
                calendar: {
                    sameDay: '[Hoy] LT',
                    nextDay: '[Mañana] LT',
                    nextWeek: 'dddd [Siguiente semana] LT',
                    lastDay: '[Ayer] LT',
                    lastWeek: 'dddd [Semana pasada] LT',
                    sameElse: 'L'
                },
                relativeTime: {
                    future: 'hasta %s',
                    past: 'desde %s',
                    s: 'cualquier segundo',
                    m: 'un minuto',
                    mm: '%d minutos',
                    h: 'una hora',
                    hh: '%d horas',
                    d: 'una hora',
                    dd: '%d horas',
                    M: 'un mes',
                    MM: '%d meses',
                    y: 'un año',
                    yy: '%d años'
                },
                //dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
                ordinal: function (number) {
                    //return number + (number === 1 ? 'er' : 'e');
                    return number;
                },
                meridiemParse: /PM|AM/,
                isPM: function (input) {
                    return input.charAt(0) === 'M';
                },
                // In case the meridiem units are not separated around 12, then implement
                // this function (look at locale/id.js for an example).
                // meridiemHour : function (hour, meridiem) {
                //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
                // },
                meridiem: function (hours) {
                    return hours < 12 ? 'AM' : 'PM';
                },
                week: {
                    dow: 1, // Monday is the first day of the week.
                    doy: 4  // Used to determine first week of the year.
                }
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
