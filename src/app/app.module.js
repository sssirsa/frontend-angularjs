(function() {
    'use strict';

    angular
        .module('app', ['sssirsa.config',
            'triangular',
            'permission',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            'ui.router', 'googlechart', 'chart.js', 'linkify', 'ui.calendar',
            'angularMoment','pascalprecht.translate','tmh.dynamicLocale', 'textAngular', 'hljs', 'md.data.table','ngMdIcons',
            'vAccordion', 'ngMaterialDatePicker','mdPickers','cgBusy','ADM-dateTimePicker', 'minicolors',

            angularDragula(angular), 'ngFileUpload', 'checklist-model',

            'app.translate',
            'toastr',
            'restangular',

            // only need one language?  if you want to turn off translations
            // comment out or remove the 'app.translate', line above
            //'app.examples',
            'app.permission',
            'app.mainApp',

            //galeria de imagenes
            'thatisuday.ng-image-gallery'

        ]);
})();
