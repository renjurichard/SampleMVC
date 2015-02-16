/**
 *
 *  This QuizBuilder module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */

    "use strict";

angular.module('QuizApp')
.factory('QuizBuilder',function ()
        {
           var buildFromJSON = function( data )
                {
                    var quiz         = null,
                        index        = -1,
                        numQuestions = 0,

                        /**
                         * Accessor to current question
                         * @returns {Question}
                         */
                        currentQuestion = function()
                        {
                            var inRange = (numQuestions > 0) && (index > -1) && (index < (numQuestions - 1));

                            return inRange ? quiz.questions[ index ] : null;
                        },

                        /**
                         * Find question at specified index
                         * @returns {Question}
                         */
                        findAtIndex = function( val )
                        {
                            var inRange, question;

                            // external world uses 1-based, here is 0-based.
                            val     = val - 1;

                            inRange  = (numQuestions > 0) && (val > -1) && (val < numQuestions);
                            question = inRange ? quiz.questions[ val ] : null;
                            index    = inRange ? val                   : index;

                            return question;
                        },

                        /**
                         * Pre-check to determine if another question is still
                         * available/unanswered.
                         *
                         * @returns {number|boolean}
                         */
                        hasNext = function()
                        {

                            return numQuestions && (index < (numQuestions - 1) );
                        },

                        /**
                         * Increment to the next question and return reference
                         * @returns {*}
                         */
                        nextQuestion = function()
                        {
                            console.log("currentQuestion from builder" + index);
                            //index++;
                            return hasNext() ? quiz.questions[++index ] : null;
                        },

                        /**
                         * Clear the tester's answers and any score summary information
                         */
                        resetQuiz = function()
                        {
                            
                            // Start again with first question..
                            index = -1;

                            // NOTE: Since the answers are temporarily part of each question,
                            //       we should clear user-given answers !

                            _.every( quiz.questions, function( question )
                            {
                                // Clear `selected` value..
                                if ( question.hasOwnProperty("selected") )
                                {
                                    question.selected = undefined;
                                }
                            });

                        },

                        /**
                         * Massage the questions to `inject` an index for output like:
                         *
                         *  <index>) <question>
                         *
                         * @returns {Quiz}
                         */
                        addQuestionIndices = function( quiz )
                        {
                            _.each(quiz.questions,  function(question, index) {
                                // Inject Question # value
                                question.index = index + 1;
                            });

                            return quiz;
                        },

                        /**
                         * Create instance of a Quiz object
                         * @returns {*}
                         */
                        buildQuizInstance = function()
                        {
                          

                            numQuestions = data.questions.length;

                            // Create instance of a Quiz object

                            quiz = {

                                // properties

                                uid            : data.uid,
                                name           : data.name,
                                current        : currentQuestion,
                                questions      : [].concat( data.questions ),

                                // methods

                                calculateScore : undefined,
                                reset          : resetQuiz,
                                hasNext        : hasNext,
                                nextQuestion   : nextQuestion,
                                seekQuestion   : findAtIndex

                            };

                            return addQuestionIndices(quiz);
                        };


                   
                    if ( data == null )           { data =  {};            }
                    if ( data.questions == null ) { data.questsions = [ ]; }

                    return buildQuizInstance();
                };

            // Publish API to build Quiz instances from JSON data

            return {

               fromJSON : buildFromJSON
                };

    });
           




