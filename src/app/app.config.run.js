/**
 * Created by Emmanuel on 15/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .run(Run);
    function Run(
        amMoment
    ) {
        amMoment.changeLocale('es');

    }
})();
