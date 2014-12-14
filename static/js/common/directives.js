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
                    getText();
                    element.on('keyup.editable paste.editable', getText);

                    element.on('$destroy', function() {
                        element.off('keyup.editable paste.editable', getText);
                    });

                    function getText() {
                        var text = element[0].innerText;
                        ngModelCtrl.$setViewValue(text);
                    }
                }
            };
        }
    ]).directive('hammerTap', [
        function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var hammer = new Hammer(element[0]);
                    hammer.on('tap', handler);
                    element.on('$destroy', function() {
                        hammer.off('tap', handler);
                    });

                    function handler() {
                        scope.$apply(attrs.hammerTap);
                    }
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
    ])
    /**
     * 放在html元素的属性当中，用于检测设备相关的东西，比如屏幕大小，检测数据放在$rootScope当中
     */
    .directive('deviceDetect', [
        '$rootScope',
        'safeApply',
        function(
            $rootScope,
            safeApply
        ) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    if (element[0].tagName.toLowerCase() !== 'html') return;
                    function getDeviceData() {
                        safeApply($rootScope, function($scope) {
                            $scope.device = {
                                viewWidth: window.innerWidth,
                                viewHeight: window.innerHeight
                            };
                        });
                    }
                    var $win = $(window);
                    getDeviceData();

                    $win.on('resize', getDeviceData);
                    element.on('$destroy', function() {
                        $win.off('resize', getDeviceData);
                    });
                }
            }
        }
    ]);

    return directivesModule;
});
