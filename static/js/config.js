var config = {
    appDir: '/static/',
    baseUrl: '/static/',
    paths: {
        jquery: 'lib/jquery/jquery-1.11.1.min',
        bootstrap: 'lib/bootstrap-3.3.1/js/bootstrap.min',
        angular: 'lib/angular/angular'
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        angular: {
            deps: ['jquery']
        }
    }
};

requirejs.config(config);