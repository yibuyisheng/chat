define(['jquery', 'angular', 'js/common/services'], function($) {
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
    ]);

    return directivesModule;
});