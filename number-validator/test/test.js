// @ts-nocheck
var tester = (function() {
    var info;
    var regex;
    var testFormat;
    var testTrue = function(str) {
        console.assert(regex.test(str), 'Format: ' + testFormat + ', TrueCase: ' + str);
    };
    var testFalse = function(str) {
        console.assert(!regex.test(str), 'Format: ' + testFormat + ', FalseCase: ' + str);
    };

    return {
        bench: function() {
            var info = NumberValidator('7.7');
            var regex = info.numberRegex;
            var ts = performance.now();
            var res = true;
            for (var i = 0; i < 1000; ++i) {
                res = res && NumberValidator('7.7').numberRegex.test('333.333');
            }
            var te = performance.now();

            console.log((te - ts) + ' ms');
        },
        test2: function() {
            testFormat = '2';
            info = NumberValidator(testFormat);
            regex = info.numberRegex;

            // positive
            testTrue('0');
            testTrue('3');
            testTrue('33');

            // negative
            testTrue('-0');
            testTrue('-3');
            testTrue('-33');

            // no match
            testFalse('');
            testFalse('.');
            testFalse('-');
            testFalse('-.');
            testFalse('00');
            testFalse('.0');
            testFalse('333');
            testFalse('3.');
            testFalse('3..');
        },
        test2d0: function() {
            testFormat = '2.0';
            info = NumberValidator(testFormat);
            regex = info.numberRegex;

            // positive
            testTrue('0');
            testTrue('0.');
            testTrue('3');
            testTrue('3.');
            testTrue('33');
            testTrue('33.');

            // negative
            testTrue('-0');
            testTrue('-0.');
            testTrue('-3');
            testTrue('-3.');
            testTrue('-33');
            testTrue('-33.');

            // no match
            testFalse('');
            testFalse('.');
            testFalse('-');
            testFalse('-.');
            testFalse('00');
            testFalse('.0');
            testFalse('333');
            testFalse('3..');
            testFalse('33..');
        },
        test2d2: function() {
            testFormat = '2.2';
            info = NumberValidator(testFormat);
            regex = info.numberRegex;

            // positive
            testTrue('0');
            testTrue('0.');
            testTrue('0.0');
            testTrue('0.00');
            testTrue('.0');
            testTrue('.00');
            testTrue('3');
            testTrue('33');
            testTrue('3.');
            testTrue('33.');
            testTrue('.3');
            testTrue('.33');
            testTrue('3.3');
            testTrue('3.33');
            testTrue('33.3');
            testTrue('33.33');

            // negative
            testTrue('-0');
            testTrue('-0.0');
            testTrue('-0.00');
            testTrue('-.0');
            testTrue('-.00');
            testTrue('-3');
            testTrue('-33');
            testTrue('-3.');
            testTrue('-33.');
            testTrue('-.3');
            testTrue('-.33');
            testTrue('-3.3');
            testTrue('-3.33');
            testTrue('-33.3');
            testTrue('-33.33');

            // no match
            testFalse('');
            testFalse('.');
            testFalse('-');
            testFalse('-.');
            testFalse('00');
            testFalse('.000');
            testFalse('333');
            testFalse('0..');
            testFalse('3..');
            testFalse('3..3');
            testFalse('333..');
            testFalse('.333');
            testFalse('3.333');
            testFalse('33.333');
        },
        test0d2: function() {
            testFormat = '0.2';
            info = NumberValidator(testFormat);
            regex = info.numberRegex;

            // positive
            testTrue('.3');
            testTrue('.33');

            // negative
            testTrue('-.3');
            testTrue('-.33');

            // no match
            testFalse('');
            testFalse('.');
            testFalse('-');
            testFalse('-.');
            testFalse('0.');
            testFalse('0.3');
            testFalse('0.33');
            testFalse('-0');
            testFalse('-0.');
            testFalse('-0.3');
            testFalse('-0.33');
        },
        test0d0: function() {
            testFormat = '0.0';
            info = NumberValidator(testFormat);
            regex = info.numberRegex;

            // no match
            testFalse('');
            testFalse('.');
            testFalse('..');
            testFalse('-');
            testFalse('--');
            testFalse('-.');
            testFalse('3');
            testFalse('.3');
            testFalse('-.3');
            testFalse('0');
            testFalse('0.');
            testFalse('0.3');
            testFalse('-0');
            testFalse('-0.');
            testFalse('-0.3');
        },
    };
})();

tester.bench();
tester.test2();
tester.test2d0();
tester.test2d2();
tester.test0d2();
tester.test0d0();
