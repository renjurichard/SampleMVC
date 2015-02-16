'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'QuizApp',
    'ngRoute',
    'ngCookies',
    'supplant',
    'underscore',
    'ngSanitize'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
       /* .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })*/

        .when( '/quiz/:question?', {
            templateUrl : "/assets/views/quiz.tpl.html",
            controller  : "TestController"
        })
        .when( '/scoring', {
            templateUrl : "/assets/views/score.tpl.html",
            controller  : "ScoreController"
        })
        .otherwise({
            redirectTo  : '/login'
        });

 
        //.otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http','session',
    function ($rootScope, $location, $cookieStore, $http,session) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);