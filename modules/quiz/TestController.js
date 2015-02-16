
angular.module('QuizApp')
.controller('TestController',['$scope','session', 'QuizDelegate', '$location', '$routeParams','$window',
    function ( $scope, session, QuizDelegate, $location, $routeParams,$window )
        {
          var VIEW_QUESTION = "/quiz/{index}",
            VIEW_SCORING  = "/scoring",
            ANSWER_NEEDED = "Before you can continue, please select your answer!";

            

                var quiz = session.quiz,
                    /**
                     * Navigate to and display the next question
                     */
                    nextQuestion = function()
                    {
                        var question = null,
                            url      = "";

                        

                        // Fail if the user did NOT select an answer ?

                        if ( $scope.challenge && ($scope.challenge.selected === undefined) )
                        {
                                                return;
                        }

                        // Lookup the next question to build and navigate to the URL
 
                        question = quiz.nextQuestion();
                        
                        url      = '/quiz/'+question.index;//supplant( VIEW_QUESTION, question );

                        $location.path( url );

                    },
                    /**
                     * Submit the quiz and answers and build the test score details
                     */
                    submitTest = function()
                    {
                        

                       
                            return QuizDelegate
                                    .QuizGetter
                                    .submitQuiz( quiz )
                                    .then( function( score )
                                    {
                                       // Cache score information for use by ScoreController
                                       // Navigate to `Score Results` view
                                       session.score = score;
                                       session.quiz  = null;

                                       
                                       $location.path( VIEW_SCORING );

                                    });
                        

                    },
                    /**
                     * Auto-load the quiz and prepare to show the first question...
                     */
                    loadQuiz = function( quizID )
                    {
                        
                            // Load the quiz and save to the session cache
                            // NOTE: do not publish the entire `quiz` to scope... to much visibility

                            return QuizDelegate
                                .QuizGetter
                                    .loadQuiz( quizID )
                                    .then( function( instance )
                                    {
                                        
                                        // Save the quiz to the session cache
                                        session.quiz    = quiz = instance;
                                        $scope.quizName = quiz.name;

                                        nextQuestion();
                                    });
                        
                    },

                    /**
                     * Do we already have the question loaded `into` the view ?
                     * @param qIndex Integer index of the question if the questions list
                     * @returns {*|boolean}
                     */
                    questionAlreadyLoaded = function( qIndex )
                    {
                        return $scope.challenge && ($scope.challenge.index === qIndex );
                    },

                    /**
                     * Check if specific question is `bookmarked` and should be loaded immediately
                     *
                     */
                    loadBookMarkedQuestion = function( qIndex )
                    {
                        var question = null;

                        // Use specified index or default to 1st question

                        qIndex = qIndex || $routeParams.question || 1;

                        $scope.next      = nextQuestion;
                        $scope.btnTitle  = "Continue";

                        // If we can lookup a question in the quiz, find that question and publish to $scope ?

                        if ( quiz && angular.isDefined( qIndex ) && !questionAlreadyLoaded( qIndex ) )
                        {
                          
                            question = quiz.seekQuestion( qIndex );

                           

                            // The last question will `submit` the quiz answers...

                            $scope.next     = quiz.hasNext() ? nextQuestion : submitTest;
                            $scope.btnTitle = quiz.hasNext() ? "Continue"   : "Submit";
                        }

                        return question;
                    };


                // Load selected quiz and configure presentation model
                // data for view consumption

               if  ( !quiz) 
               {
                      loadQuiz( session.selectedQuiz );
               }


                $scope.quizName  = quiz ? quiz.name : "";
                $scope.challenge = loadBookMarkedQuestion();

            }]);
