'use strict';

angular.module('rpgApp')
  .controller('PaginationController', function ($state, $scope, Auth) {
  	var vm = $scope;

    vm.chunks = []
    $scope.$watch('srcArray',function(newValue, oldValue){
      var pageSize = 10
      vm.chunks = _.chunk(newValue, pageSize)
      vm.totalPages = Math.ceil(newValue.length / pageSize)
      vm.setPage(0)
    })

    vm.setPage = function(page) {
      if (page < 0 || page > vm.totalPages -1) {
        return;
      }
      vm.currentPage = page

      var startPage, endPage
      if(vm.totalPages <= 10){
        startPage = 0;
        endPage = vm.totalPages;
      } else {
          if (vm.currentPage <= 6) {
              startPage = 0;
              endPage = 9;
          } else if (vm.currentPage + 3 >= vm.totalPages) {
              startPage = vm.totalPages -9;
              endPage = vm.totalPages;
          } else {
              startPage = vm.currentPage - 6;
              endPage = vm.currentPage + 3;
          }
      }
      
      $scope.ngModel = vm.chunks[page]
      vm.page = _.range(startPage, endPage)
    }

    _.chunk = function(array,chunkSize) {
        return _.reduce(array,function(reducer,item,index) {
            reducer.current.push(item);
            if(reducer.current.length === chunkSize || index + 1 === array.length) {
                reducer.chunks.push(reducer.current);
                reducer.current = [];
            }
            return reducer;
        },{current:[],chunks: []}).chunks
    };

  });
