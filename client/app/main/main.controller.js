'use strict';


angular.module('rpgApp').controller('MainController', function ($scope, Auth) {
	var vm = $scope 

 $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function(src, offset) {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: src,
      style : {'transform': 'translateY(-' + offset + '%)'},
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  $scope.addSlide('assets/img/caroussel_1.jpg',40);
  $scope.addSlide('assets/img/caroussel_2.jpg',20);
  $scope.addSlide('assets/img/caroussel_3.jpg',20);
  $scope.addSlide('assets/img/caroussel_4.jpg',50);

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }

})