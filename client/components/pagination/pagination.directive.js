'use strict';

angular.module('rpgApp')
  .directive('pagination', () => ({
    templateUrl: 'components/pagination/pagination.html',
    restrict: 'E',
    scope: {
        ngModel: '=',
        srcArray: '=',
    },
    controller: 'PaginationController',
    controllerAs: 'vm'
  }));
