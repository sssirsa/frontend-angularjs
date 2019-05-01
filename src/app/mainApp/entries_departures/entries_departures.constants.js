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
            departures: {
                base: 'departures',
                new: 'news',
                obsolete: 'scrapped',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse',
                warranty: 'warranties',
                addCabinet: 'add_cabinet',
                close: 'close'
            },
            entries: {
                addCabinet: 'add_cabinet',
                base: 'entries',
                close: 'close',
                new: 'news',
                repair: 'repair',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse',
                warranty: 'warranties'
            },
            inspections: {
                base: 'inspections',
                preliminary_inspection:'preliminary_inspection'
            },
            subsidiary_change: {}
        });
})();
