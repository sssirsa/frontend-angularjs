(function () {
    angular
        .module('app.mainApp.entries_departures')
        .constant('ENTRIES_DEPARTURES', {
            base: 'entries-departures',
            catalogues: {
                base: 'catalogues',
                udn: 'udn',
                transport_line: 'transport_line',
                transport_type: 'transport_type',
                sticker: 'sticker'
            },
            changes: {
                base: 'changes',
                agency: 'udn',
                agency_confirm: 'confirm_udn',
                subsidiary: 'subsidiary',
                subsidiary_confirm: 'confirm_subsidiary'
            },
            departures: {
                base: 'departures',
                all: 'all',
                new: 'news',
                obsolete: 'scrapped',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse',
                warranty: 'warranties',
                addCabinet: 'add_cabinet',
                close: 'close'
            },
            entries: {
                base: 'entries',
                addCabinet: 'add_cabinet',
                all: 'all',
                close: 'close',
                new: 'news',
                repair: 'repair',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse',
                warranty: 'warranties'
            },
            inspections: {
                base: 'inspections',
                preliminary_inspection: 'preliminary_inspection'
            },
            subsidiary_change: {}
        });
})();
