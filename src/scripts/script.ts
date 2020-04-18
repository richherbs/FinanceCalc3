interface aLoan {
    loan:number,
    salary:number,
    repayment:number,
    extraFee:number,
    adminFee:number,
    repaymentTerm:number,
    totalLoan:number,
    repaymentInPounds:number,
    finalMonthRepayment:number
}

const NUMBERSONLY:RegExp = /^[0-9]+$/;
let inputs: NodeList = document.querySelectorAll('input');
let calculate: Node = document.querySelector('.calculate');
let calculationContainer: Node = document.querySelector('.calculation-container');
let loanInputValueIsCorrect = false;
let salaryInputValueIsCorrect = false;
let repaymentInputValueIsCorrect = false;

const calculateExtraFee = (someLoan:number):number => {
    if(someLoan < 6400) return 0
    else if (someLoan > 7200) return 1000
    return 500;
}

const calculateAdminFee = (someLoan:number):number => someLoan * 0.05;

const calculateRepaymentInPounds = (someRepayment:number, someSalary:number):number => (someRepayment/100)*(someSalary/12);

const calculateRepaymentTerm = (totalLoan:number, repaymentInPounds:number):number => Math.ceil(totalLoan / repaymentInPounds);

const calculateTotalLoan = (extraFee:number, adminFee:number, someLoan:number):number => extraFee+adminFee+someLoan;

const populateCalculationContainer = async (aTemplate :string) => {
        let response = await fetch(`dist/templates/${aTemplate}`);
        let template = await response.text();
        return template;
}

const calculateFinalMonthRepayment = (totalLoan:number, repaymentTerm:number) => totalLoan % repaymentTerm;

const roundToTwoDecimalPlaces = (aNumberToRound:number):number => Math.round((aNumberToRound + Number.EPSILON) * 100) / 100;

const checkInputIsANumber = (anInputValue:string) => NUMBERSONLY.test(anInputValue);

const checkInputInRange = (anInputValue:string, lowerValue:number, upperValue:number) => parseFloat(anInputValue) >= lowerValue && parseFloat(anInputValue) <= upperValue;

const checkInputValueLength = (anInputValue:string) => anInputValue.length <= 0;

inputs.forEach((input:HTMLInputElement) => {
    input.addEventListener("blur", (e:Event) => {
        let activeElement:EventTarget = e.target;

        if ((<HTMLInputElement>activeElement).name == "loan"){
            if(checkInputIsANumber((<HTMLInputElement>activeElement).value) && checkInputInRange((<HTMLInputElement>activeElement).value, 1, 8000)){
                loanInputValueIsCorrect = true;
                (<HTMLInputElement>activeElement).style.backgroundColor = 'white';
            } else {
                loanInputValueIsCorrect = false;
                (<HTMLInputElement>activeElement).value = '';
                (<HTMLInputElement>activeElement).placeholder = 'This value must be between £1 and £8000';
                (<HTMLInputElement>activeElement).style.backgroundColor = 'red';
            }
        }
        
        if ((<HTMLInputElement>activeElement).name == "repayment"){
            if(checkInputIsANumber((<HTMLInputElement>activeElement).value) && checkInputInRange((<HTMLInputElement>activeElement).value, 1, 100)){
                repaymentInputValueIsCorrect = true;
                (<HTMLInputElement>activeElement).style.backgroundColor = 'white';
            } else {
                repaymentInputValueIsCorrect = false;
                (<HTMLInputElement>activeElement).value = '';
                (<HTMLInputElement>activeElement).placeholder = 'This value must be between 10% and 100%';
                (<HTMLInputElement>activeElement).style.backgroundColor = 'red';
            }
        }

        if ((<HTMLInputElement>activeElement).name == "salary"){
            if(checkInputIsANumber((<HTMLInputElement>activeElement).value) && checkInputInRange((<HTMLInputElement>activeElement).value, 0, Infinity)){
                salaryInputValueIsCorrect = true;
                (<HTMLInputElement>activeElement).style.backgroundColor = 'white';
            } else {
                salaryInputValueIsCorrect = false;
                (<HTMLInputElement>activeElement).value = '';
                (<HTMLInputElement>activeElement).placeholder = 'Please enter your projected gross annual salary';
                (<HTMLInputElement>activeElement).style.backgroundColor = 'red';
            }
        }
    })
})

calculate.addEventListener('click', (e) => {
    e.preventDefault();
    (<HTMLElement>calculationContainer).classList.remove('display-none');
    if(loanInputValueIsCorrect && repaymentInputValueIsCorrect && salaryInputValueIsCorrect){
        var newLoan:aLoan = {
            loan: Number((<HTMLInputElement>inputs[0]).value),
            salary: Number((<HTMLInputElement>inputs[1]).value),
            repayment: Number((<HTMLInputElement>inputs[2]).value),
            adminFee: 0,
            repaymentInPounds: 0,
            totalLoan: 0,
            repaymentTerm: 0,
            extraFee: 0,
            finalMonthRepayment: 0
        }

        newLoan.extraFee = roundToTwoDecimalPlaces(calculateExtraFee(newLoan.loan));
        newLoan.adminFee = roundToTwoDecimalPlaces(calculateAdminFee(newLoan.loan));
        newLoan.repaymentInPounds = roundToTwoDecimalPlaces(calculateRepaymentInPounds(newLoan.repayment, newLoan.salary));
        newLoan.totalLoan = roundToTwoDecimalPlaces(calculateTotalLoan(newLoan.extraFee, newLoan.adminFee, newLoan.loan));
        newLoan.repaymentTerm = calculateRepaymentTerm(newLoan.totalLoan, newLoan.repaymentInPounds);
        newLoan.finalMonthRepayment = roundToTwoDecimalPlaces(calculateFinalMonthRepayment(newLoan.totalLoan, newLoan.repaymentTerm));

        console.log(newLoan);

        if(newLoan.finalMonthRepayment > 0){
            populateCalculationContainer("calculationFinalMonthRepayment.mustache").then(template => {
                let rendered = Mustache.render(template, newLoan)
                document.querySelector('.calculation-container').innerHTML = rendered;
            })
        } else {
            populateCalculationContainer("calculation.mustache").then(template => {
                let rendered = Mustache.render(template, newLoan)
                document.querySelector('.calculation-container').innerHTML = rendered;
            })
        }
    } else {
        if( checkInputValueLength((<HTMLInputElement>inputs[0]).value) || checkInputValueLength((<HTMLInputElement>inputs[1]).value) || checkInputValueLength((<HTMLInputElement>inputs[2]).value)){
            let rendered = Mustache.render("<div class='last-child'>{{message}}</div>", {message:"You must fill out all inputs"})
            document.querySelector('.calculation-container').innerHTML = rendered;
        } else {
            let rendered = Mustache.render("<div class='last-child'>{{message}}</div>", {message:"There was an error. Please see the red input for the error in your form."})
            document.querySelector('.calculation-container').innerHTML = rendered;
        }
    }
})