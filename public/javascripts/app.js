'use strict';

var tumblrApp = angular.module("tumblr", ['ngRoute', 'ui.bootstrap']);

// Route
tumblrApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../partials/main.html',
            controller: 'MainController'
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}]);

// Controllers
tumblrApp.controller("MainController", ['$scope','$http', '$timeout', function($scope, $http, $timeout) {
    $scope.myInterval = 8000;
    $scope.photos = [];
    $scope.windowHeight = window.innerHeight + 'px';
    $scope.blogUrl = '';

    $scope.search = function(e) {
        if (e.which == 13) {
            $scope.showLoader = true;
            $http.get('/getData/' + $scope.blogUrl).success (function(response) {
                if (response && response.err) {
                    $scope.photos = [];
                    $scope.showLoader = false;
                    alert('Blog bulunamadı.');
                } else if (response.data) {
                    $scope.photos = [];
                    var data = response.data;
                    data.posts && data.posts.length && data.posts.forEach(function(post) {
                        post['photos'].forEach(function(photo) {
                            $scope.photos.push({
                                image: photo['original_size']['url']
                            })
                        });
                    });

                    $scope.showLoader = false;
                    if ($scope.photos.length)
                        $scope.photos[0].active = true;
                }
            });
        }
    };
}]);
