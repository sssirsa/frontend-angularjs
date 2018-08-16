(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .directive('whenScrollEnds', WhenScrollEndsDirective);

    function WhenScrollEndsDirective() {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var container = element.find('md-content');
                container.css('height', '300px');
                var visibleHeight = 300;
                var threshold = 100;

                container.on('scroll', function (e) {
                    var scrollableHeight = container.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;
                    if (hiddenContentHeight - container[0].scrollTop <= threshold) {
                        scope.$apply(attrs.whenscrollends);
                    }
                });

            }
        }
    }
})()
