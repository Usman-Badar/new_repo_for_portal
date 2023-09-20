/* eslint-disable no-array-constructor */
/* eslint-disable eqeqeq */
export function convertCurrency(numString) {
    let bigNumArry = new Array('', ' thousand', ' million', ' billion', ' trillion', ' quadrillion', ' quintillion');

    let output = '';
    let finlOutPut = new Array();

    if (numString == '0') {
        return 'Zero';
    }

    if (numString == 0) {
        return 'Zero';
    }

    let i = numString.length;
    i = i - 1;

    //cut the number to grups of three digits and add them to the Arry
    while (numString.length > 3) {
        let triDig = new Array(3);
        triDig[2] = numString.charAt(numString.length - 1);
        triDig[1] = numString.charAt(numString.length - 2);
        triDig[0] = numString.charAt(numString.length - 3);

        let varToAdd = triDig[0] + triDig[1] + triDig[2];
        finlOutPut.push(varToAdd);
        i--;
        numString = numString.substring(0, numString.length - 3);
    }
    finlOutPut.push(numString);
    finlOutPut.reverse();

    //conver each grup of three digits to english word
    //if all digits are zero the triConvert
    //function return the string "dontAddBigSufix"
    for (let j = 0; j < finlOutPut.length; j++) {
        finlOutPut[j] = triConvert(parseInt(finlOutPut[j]));
    }

    let bigScalCntr = 0; //this int mark the million billion trillion... Arry

    for (let b = finlOutPut.length - 1; b >= 0; b--) {
        if (finlOutPut[b] != "dontAddBigSufix") {
            finlOutPut[b] = finlOutPut[b] + bigNumArry[bigScalCntr] + '';
            bigScalCntr++;
        }
        else {
            //replace the string at finlOP[b] from "dontAddBigSufix" to empty String.
            finlOutPut[b] = '';
            bigScalCntr++; //advance the counter  
        }
    }

    //convert The output Arry to , more printable string 
    for (let n = 0; n < finlOutPut.length; n++) {
        output += finlOutPut[n];
    }

    return output;//print the output
}

//simple function to convert from numbers to words from 1 to 999
function triConvert(num) {
    let ones = new Array('', ' one', ' two', ' three', ' four', ' five', ' six', ' seven', ' eight', ' nine', ' ten', ' eleven', ' twelve', ' thirteen', ' fourteen', ' fifteen', ' sixteen', ' seventeen', ' eighteen', ' nineteen');
    let tens = new Array('', '', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', ' eighty', ' ninety');
    let hundred = ' hundred';
    let output = '';
    let numString = num.toString();

    if (num == 0) {
        return 'dontAddBigSufix';
    }
    //the case of 10, 11, 12 ,13, .... 19 
    if (num < 20) {
        output = ones[num];
        return output;
    }

    //100 and more
    if (numString.length == 3) {
        output = ones[parseInt(numString.charAt(0))] + hundred;
        output += tens[parseInt(numString.charAt(1))];
        output += ones[parseInt(numString.charAt(2))];
        return output;
    }

    output += tens[parseInt(numString.charAt(0))];
    output += ones[parseInt(numString.charAt(1))];

    return output;
}   