/**
 * 联系人
 */
define(['js/module/module-helper'], function(helper) {
    helper.getModule('moduleModule').directive('contact', [
        '$http',
        function(
            $http
        ) {
            return {
                restrict: 'E',
                scope: {'friends': '=friends'},
                templateUrl: '/ngtpls/contact',
                link: function(scope, element, attrs) {
                }
            };
        }
    ]);
});