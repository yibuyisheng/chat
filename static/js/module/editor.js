define([
    'js/module/module-helper',
    'js/module/message-middleware',
    'angular'
], function(
    helper,
    messageMiddleware
) {
    helper.getModule('moduleModule')
    .directive('emotion', [
        function() {
            
        }
    ])
    .directive('editor', [
        function(
        ) {
            return {
                restrict: 'E',
                template: [
                    '<div>表情</div>',
                    '<div class="content" contenteditable ng-model="content">'
                ].join(''),
                scope: {content: '='},
                link: function(scope, element, attrs) {
                    
                }
            };
        }
    ]);
});