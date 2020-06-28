const {addWeight} =  require('./data')
const getPerson = function(body){
    const person = {...body};
    person.club = !!body.club;
    person.financialAid = !!body.financialAid;
    person.sportTeam = !!body.sportTeam;
    person.prediction = addWeight(
        parseInt(person.highSchoolGPA),
        person.gender, 
        person.club, 
        person.sportTeam, 
        person.logisticStatus, 
        person.financialAid);
    return person;
}


module.exports = {getPerson};