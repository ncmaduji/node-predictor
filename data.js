const faker = require('faker');

//This example returns a random number between the specified values.
function getRandomFloatArbitrary(min, max, n) {
    // represents the decimal place.
    return (Math.random() * (max - min) + min).toFixed(n);
  }
 
function getSampleSize(){
    return 10;
}


// randomize the values in an array.
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getConstraints (percent){
    return percent * getSampleSize();
    
}

function addWeight(gpa, club, sportTeam, logisticsStatus, financialAid){
    const totalWeight = 100;
    const gpaTotalWeight = 0.7 * totalWeight;
    const clubTotalWeight = 0.1 * totalWeight;
    const sportTeamTotalmWeight = 0.1 * totalWeight;
    const logisticsStatusTotalWeight = .05 * totalWeight;
    const financialAidTotalWeight = .05 * totalWeight;
    
    let gpaWeight;
    let clubWeight;
    let sportTeamWeight;
    let logisticsStatusWeight;
    let financialAidWeight;
   //63+8+8+3+4
   //49+8+8+2+4

   //6+8+2+4
        
    if(gpa >= 3.8){
        gpaWeight = 0.9 * gpaTotalWeight;
    } else if (gpa >=3.4 && gpa < 3.8){
        gpaWeight = 0.8 * gpaTotalWeight;
    } else if(gpa >=2.5 && gpa <= 3.3){
        gpaWeight = 0.7 * gpaTotalWeight;
    }else if(gpa >= 0.0 && gpa <2.5) {
        gpaWeight = .60 * gpaTotalWeight
    }
    
    
    
        
    if(club){
        clubWeight = .8 * clubTotalWeight;
    } else {
        clubWeight = .6 * clubTotalWeight;
    }
    
    
    // negatively affects 
    
    if(sportTeam){
        sportTeamWeight = .2 * sportTeamTotalmWeight;
    } else {
        sportTeamWeight = .8 * sportTeamTotalmWeight;
    }
    
    
    
    if(logisticsStatus === 'Resident'){
        logisticsStatusWeight = .6 * logisticsStatusTotalWeight;
    } else {
        logisticsStatusWeight = .4 * logisticsStatusTotalWeight;
    }
    
    
    
    if(financialAid){
        financialAidWeight = .8 * financialAidTotalWeight;
    } else {
        financialAidWeight = .6 * financialAidTotalWeight
    }
    
    return  gpaWeight + clubWeight + sportTeamWeight + logisticsStatusWeight + financialAidWeight;
}

function populateArray(constraintSize, gpaMax, gpaMin, typeOfData){
    const array = [];
    for(let i=0; i<getSampleSize(); i++){

        if(typeOfData.first === 'highSchoolGPA'){
            if(i < constraintSize){
                // number of people with a certain gpa range eg. 3.5-4.0
                array.push(getRandomFloatArbitrary(gpaMin, gpaMax, 2));
            } else {
                array.push(getRandomFloatArbitrary(0.0, 4.0, 2));
            }       
        } else {
            if(i < constraintSize){
                // number of people with first and second choice.
                array.push(typeOfData.first)
            } else {
                array.push(typeOfData.second)
            }
        }

    }
    return array;
}

function generateHighSchoolGPA(percent=0, gpaMax=4.0, gpaMin=0.0){
    return shuffleArray(populateArray(getConstraints(percent),gpaMax, gpaMin, {first: 'highSchoolGPA'}));
}

function generateInternationStatus(percent =0){
    return shuffleArray(populateArray(getConstraints(percent), undefined, undefined, {first: 'Domestic', second:'International'}));
}

function generateLogisticsStatus(percent){
    return shuffleArray(populateArray(getConstraints(percent), undefined, undefined, {first: 'Resident', second:'Commuter'}));
}

function generateGender(percent){
    return shuffleArray(populateArray(getConstraints(percent), undefined, undefined, {first: 'Male', second:'Female'}));
}

// this is for sporteam, club, financial aid and scholarship.
function generateBooleanValues(percent){
    return shuffleArray(populateArray(getConstraints(percent), undefined, undefined, {first: true, second:false}));
}


const data = {
    highSchoolGPA: generateHighSchoolGPA(.2, 3.50, 4.0),
    internationStatus: generateInternationStatus(.5),
    logisticsStatus: generateLogisticsStatus(.5),
    gender: generateGender(.5),
    sporteam: generateBooleanValues(.5),
    club: generateBooleanValues(.5),
    financialAid: generateBooleanValues(.5),
    gender: generateGender(.6)
}
    


function generateEnrollmentData(){
    const array = [];
    for(let i=0; i<getSampleSize(); i++){
        const person = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            highSchoolGPA: data.highSchoolGPA[i],
            gender: data.gender[i],
            club: data.club[i],
            financialAid: data.financialAid[i],
            sportTeam: data.sporteam[i],
            logisticsStatus: data.logisticsStatus[i],
        }
        person.prediction = addWeight(person.highSchoolGPA, person.club, person.sportTeam, person.logisticsStatus, person.financialAid);
        array.push(person);
    }
    return array;
}

module.exports =  {generateEnrollmentData, addWeight}

