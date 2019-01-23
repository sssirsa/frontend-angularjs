(function () {
    angular
        .module('app.mainApp.entries_departures')
        .constant('ENTRIES_DEPARTURES', {
            base: 'entries-departures',
            catalogues: {
                base: 'catalogues',
                udn: 'udn',
                project: 'project',
                transport_line: 'transport_line',
                transport_type: 'transport_type',
                sticker: 'sticker',
                pediments: 'pediments'
            },
            departures: {},
            entries: {
                base: 'entries',
                new: 'news',
                obsolete: 'scrapped',
                unrecognizable: 'no_labeled',
                warranty: 'warranties',
                addCabinet: 'add_cabinet',
                close: 'close',
                control: {
                    base: 'control',
                    cabinet_in_subsidiary: 'cabinet_in_sucursal'
                }
            },
            inspections: {},
            subsidiary_change: {}
        });
})();
