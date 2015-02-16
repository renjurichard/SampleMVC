angular.module('QuizApp', []);

angular.module('QuizApp').service('session', function($http) {

 var validate = function ( target, defaultVal )
            {
                return target || defaultVal;
            },
            onClear  = function( all )
            {
                _session.account.userName       = validate( all, false ) ? '' : _session.account.userName;
                _session.account.password       = '';
                _session.account.email          = '';
                _session.sessionID              = null;

                // TODO - refactor since these are specific to the `quiz` module

                _session.quiz                   = undefined;
                _session.score                  = undefined;
                _session.selectedQuiz           = 1;

                return _session;
            },
            _session = {
                account : {
                    userName          : '',
                    password          : '',
                    email             : ''
                },

                sessionID         : null,
                clear             : onClear,
                logout            : onClear,

                selectedQuiz      : 1
            };

  
 // return function () {
            return {session:_session}
   ///     };
});