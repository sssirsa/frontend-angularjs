(function () {
    angular.module('app.mainApp.entries_departures.departures', [
        'app.mainApp.entries_departures.departures.new',
        'app.mainApp.entries_departures.departures.obsolete',
        //'app.mainApp.entries_departures.departures.unrecognizable',
        'app.mainApp.entries_departures.departures.salepoint',
        'app.mainApp.entries_departures.departures.warehouse',
        'app.mainApp.entries_departures.departures.warranty'
    ]);
})();
