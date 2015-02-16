
    "use strict";

    var QUIZ_TEMPLATE = "http://localhost:8080/assets/data/quiz_1.json";

        angular.module('QuizApp')
        .service('QuizDelegate',["QuizBuilder","ScoreBuilder",'$http','$q',
            function (QuizBuilder, ScoreBuilder,$http,$q )
        {
                /**
                 * Builder used to create Quiz instance from JSON data
                 * @type {Quiz}
                 */
            var quizBuilder  = QuizBuilder,
                /**
                 * Builder used to create Score instances from a specified Quiz instance
                 * @type {Score}
                 */
                scoreBuilder = ScoreBuilder.Score,

                /**
                 * QuizDelegat
                 * @constructor
                 */
                QuizDelegate = function ()
                {

                        /**
                         * Util function to build a resolved promise;
                         * ...resolved with specified value
                         *
                         * @returns {promise|*|promise}
                         */
                    var makeResolved = function( response )
                        {
                            var dfd = $q.defer();
                                dfd.resolve( response );

                            return dfd.promise;
                        },

                        /**
                         * Load Quiz questions/choices/answers data
                         *
                         * @param quizID is the Quiz ID that should be loaded
                         * @return Promise
                         */
                        loadByID = function( quizID )
                        {
                            var LOAD_URL = QUIZ_TEMPLATE;

                            
                             // Loads quiz JSON from local data file and delivers a quiz instance

                             return $http
                                     .get('http://localhost:8070/assets/data/quiz_1.json')
                                     .then( function( response )
                                     {
                                        
                                        return quizBuilder.fromJSON( response.data );
                                     });
                        },

                        /**
                         * Calculate user test score for the specified quiz
                         * NOTE: this is currently performed client-side for now...
                         *
                         * @return Promise
                         */
                        submitQuiz = function( quiz, email )
                        {
                            

                             // Normally we have remote REST services...
                             // return $http.post( URL.SUBMIT_QUIZ, { quiz : quiz, who : email } );

                             // For now, ask the quiz to calculate its own score...

                             return makeResolved( scoreBuilder.calculateScore( quiz ) );
                        };


                   // Publish Authentication delegate instance/object with desired API

                   return {

                       loadQuiz        : loadByID,
                       submitQuiz      : submitQuiz

                   };

                };

           return {QuizGetter:QuizDelegate()} ;
        }]);


