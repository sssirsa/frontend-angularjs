(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(triLayoutProvider) {

        triLayoutProvider.setDefaultOption('toolbarSize', 'default');
        triLayoutProvider.setDefaultOption('toolbarShrink', false);
        triLayoutProvider.setDefaultOption('toolbarClass', '');
        triLayoutProvider.setDefaultOption('contentClass', 'full-image-background bg-01');
        triLayoutProvider.setDefaultOption('sideMenuSize', 'hidden');
        triLayoutProvider.setDefaultOption('footer', true);
    }
})();
