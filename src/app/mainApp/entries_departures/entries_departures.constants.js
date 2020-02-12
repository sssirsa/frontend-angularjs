(function () {
    angular
        .module('app.mainApp.entries_departures')
        .constant('ENTRIES_DEPARTURES', {
            base: 'entries-departures',
            catalogues: {
                base: 'catalogues',
                udn: 'udn',
                transport_driver: 'transport-driver',
                transport_line: 'transport-line',
                transport_type: 'transport-kind',
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
                all: 'all-departures',
                new: 'new-departures',
                obsolete: 'obsolete-departures',
                salepoint:'salepoint-departures',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse-departures',
                warranty: 'warranty-departures',
                addCabinet: 'add_cabinet',
                close: 'close'
            },
            entries: {
                base: 'entries',
                addCabinet: 'add_cabinet',
                all: 'all-entries',
                close: 'close',
                new: 'new-entries',
                salepoint: 'salepoint-entries',
                unrecognizable: 'no_labeled',
                warehouse: 'warehouse-entries',
                warranty: 'warranty-entries'
            },
            inspections: {
                base: 'inspections',
                preliminary_inspection: 'preliminary_inspection'
            }
        });
})();
