define(['jquery', 'hammer', 'angular', 'js/common/services'], function($, Hammer) {
    var directivesModule;
    try {
        directivesModule = angular.module('directivesModule');
    } catch (e) {
        directivesModule = angular.module('directivesModule', ['servicesModule']);
    }

    directivesModule.directive('contenteditable', [
        function(
        ) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    function getText() {
                        var text = element.text();
                        ngModelCtrl.$setViewValue(text);
                    }
                    getText();
                    element.on('keyup.editable paste.editable', getText);

                    element.on('$destroy', function() {
                        element.off('keyup.editable paste.editable', getText);
                    });
                }
            };
        }
    ]).directive('hammerTap', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var hammer = new Hammer(element[0]);
                    function handler() {
                        scope.$apply(attrs.hammerTap);
                    }
                    hammer.on('tap', handler);
                    element.on('$destroy', function() {
                        hammer.off('tap', handler);
                    });
                }
            };
        }
    ])
    /**
     * 当放在scrollBottom里面的值变动了的话，就开始判断是否应该滚动到最底部
     */
    .directive('scrollBottom', [
        '$timeout',
        function(
            $timeout
        ) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var isFirstTime = true;
                    function scrollBottom() {
                        $timeout(function() {
                            var lastChildHeight = element.find('>:last-child').outerHeight();
                            var scrollTop = element.scrollTop();
                            var scrollHeight = element[0].scrollHeight;
                            var elementHeight = element.height();

                            if (scrollHeight - scrollTop - elementHeight <= lastChildHeight + 30) {
                                element.scrollTop(scrollHeight + 1000);
                            }
                        });
                    }

                    scope.$watch(attrs.scrollBottom, scrollBottom, true);
                }
            };
        }
    ]);

    return directivesModule;
});