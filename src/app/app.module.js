(function() {
    'use strict';

    angular
        .module('app', [
            'sssirsa.config',
            'triangular',
            'permission',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            'ui.router', 'googlechart', 'chart.js', 'linkify', 'ui.calendar',
            'angularMoment','pascalprecht.translate','tmh.dynamicLocale', 'textAngular', 'hljs', 'md.data.table','ngMdIcons',
            'vAccordion', 'ngMaterialDatePicker', 'mdPickers', 'cgBusy', 'ADM-dateTimePicker', 'minicolors',
            'catalogManager',
            'catalogSelectComponent',
            'storeManager',

            angularDragula(angular), 'ngFileUpload', 'checklist-model',

            'app.translate',
            'toastr',
            'restangular',
            'app.permission',
            'app.mainApp',

            //galeria de imagenes
            'thatisuday.ng-image-gallery'

        ]);
})();
