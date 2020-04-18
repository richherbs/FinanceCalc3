var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var NUMBERSONLY = /^[0-9]+$/;
var inputs = document.querySelectorAll('input');
var calculate = document.querySelector('.calculate');
var calculationContainer = document.querySelector('.calculation-container');
var loanInputValueIsCorrect = false;
var salaryInputValueIsCorrect = false;
var repaymentInputValueIsCorrect = false;
var calculateExtraFee = function (someLoan) {
    if (someLoan < 6400)
        return 0;
    else if (someLoan > 7200)
        return 1000;
    return 500;
};
var calculateAdminFee = function (someLoan) { return someLoan * 0.05; };
var calculateRepaymentInPounds = function (someRepayment, someSalary) { return (someRepayment / 100) * (someSalary / 12); };
var calculateRepaymentTerm = function (totalLoan, repaymentInPounds) { return Math.ceil(totalLoan / repaymentInPounds); };
var calculateTotalLoan = function (extraFee, adminFee, someLoan) { return extraFee + adminFee + someLoan; };
var populateCalculationContainer = function (aTemplate) { return __awaiter(_this, void 0, void 0, function () {
    var response, template;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("dist/templates/" + aTemplate)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                template = _a.sent();
                return [2 /*return*/, template];
        }
    });
}); };
var calculateFinalMonthRepayment = function (totalLoan, repaymentTerm) { return totalLoan % repaymentTerm; };
var roundToTwoDecimalPlaces = function (aNumberToRound) { return Math.round((aNumberToRound + Number.EPSILON) * 100) / 100; };
var checkInputIsANumber = function (anInputValue) { return NUMBERSONLY.test(anInputValue); };
var checkInputInRange = function (anInputValue, lowerValue, upperValue) { return parseFloat(anInputValue) >= lowerValue && parseFloat(anInputValue) <= upperValue; };
var checkInputValueLength = function (anInputValue) { return anInputValue.length <= 0; };
inputs.forEach(function (input) {
    input.addEventListener("blur", function (e) {
        var activeElement = e.target;
        if (activeElement.name == "loan") {
            if (checkInputIsANumber(activeElement.value) && checkInputInRange(activeElement.value, 1, 8000)) {
                loanInputValueIsCorrect = true;
                activeElement.style.backgroundColor = 'white';
            }
            else {
                loanInputValueIsCorrect = false;
                activeElement.value = '';
                activeElement.placeholder = 'This value must be between £1 and £8000';
                activeElement.style.backgroundColor = 'red';
            }
        }
        if (activeElement.name == "repayment") {
            if (checkInputIsANumber(activeElement.value) && checkInputInRange(activeElement.value, 1, 100)) {
                repaymentInputValueIsCorrect = true;
                activeElement.style.backgroundColor = 'white';
            }
            else {
                repaymentInputValueIsCorrect = false;
                activeElement.value = '';
                activeElement.placeholder = 'This value must be between 10% and 100%';
                activeElement.style.backgroundColor = 'red';
            }
        }
        if (activeElement.name == "salary") {
            if (checkInputIsANumber(activeElement.value) && checkInputInRange(activeElement.value, 0, Infinity)) {
                salaryInputValueIsCorrect = true;
                activeElement.style.backgroundColor = 'white';
            }
            else {
                salaryInputValueIsCorrect = false;
                activeElement.value = '';
                activeElement.placeholder = 'Please enter your projected gross annual salary';
                activeElement.style.backgroundColor = 'red';
            }
        }
    });
});
calculate.addEventListener('click', function (e) {
    e.preventDefault();
    calculationContainer.classList.remove('display-none');
    if (loanInputValueIsCorrect && repaymentInputValueIsCorrect && salaryInputValueIsCorrect) {
        var newLoan = {
            loan: Number(inputs[0].value),
            salary: Number(inputs[1].value),
            repayment: Number(inputs[2].value),
            adminFee: 0,
            repaymentInPounds: 0,
            totalLoan: 0,
            repaymentTerm: 0,
            extraFee: 0,
            finalMonthRepayment: 0
        };
        newLoan.extraFee = roundToTwoDecimalPlaces(calculateExtraFee(newLoan.loan));
        newLoan.adminFee = roundToTwoDecimalPlaces(calculateAdminFee(newLoan.loan));
        newLoan.repaymentInPounds = roundToTwoDecimalPlaces(calculateRepaymentInPounds(newLoan.repayment, newLoan.salary));
        newLoan.totalLoan = roundToTwoDecimalPlaces(calculateTotalLoan(newLoan.extraFee, newLoan.adminFee, newLoan.loan));
        newLoan.repaymentTerm = calculateRepaymentTerm(newLoan.totalLoan, newLoan.repaymentInPounds);
        newLoan.finalMonthRepayment = roundToTwoDecimalPlaces(calculateFinalMonthRepayment(newLoan.totalLoan, newLoan.repaymentTerm));
        console.log(newLoan);
        if (newLoan.finalMonthRepayment > 0) {
            populateCalculationContainer("calculationFinalMonthRepayment.mustache").then(function (template) {
                var rendered = Mustache.render(template, newLoan);
                document.querySelector('.calculation-container').innerHTML = rendered;
            });
        }
        else {
            populateCalculationContainer("calculation.mustache").then(function (template) {
                var rendered = Mustache.render(template, newLoan);
                document.querySelector('.calculation-container').innerHTML = rendered;
            });
        }
    }
    else {
        if (checkInputValueLength(inputs[0].value) || checkInputValueLength(inputs[1].value) || checkInputValueLength(inputs[2].value)) {
            var rendered = Mustache.render("<div class='last-child'>{{message}}</div>", { message: "You must fill out all inputs" });
            document.querySelector('.calculation-container').innerHTML = rendered;
        }
        else {
            var rendered = Mustache.render("<div class='last-child'>{{message}}</div>", { message: "There was an error. Please see the red input for the error in your form." });
            document.querySelector('.calculation-container').innerHTML = rendered;
        }
    }
});
