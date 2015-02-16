/**
 *
 *  This ScoreController module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
angular.module('QuizApp').controller('ScoreController',function ( $scope, session)
        {
        
                // Configure presentation model data for view consumption

                $scope.title  = session.score ? session.score.quizName   : 0;
                $scope.grade  = session.score ? session.score.totalScore : 0;
                $scope.scores = session.score ? session.score.items      : [ ];
                //$scope.email  = session.account.email;


                $scope.logout = session.logout;
            });

 
