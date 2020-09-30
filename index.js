#!/usr/bin/env node   
//uppder line : execute the code below as NodeJS code

//get the paramaters of the command 'node ./index.js [args]' or 'npm run hollidays [args] or npx hollidates [args].
var args = process.argv.slice(2);
//console.log('args: '+ args);

//include display modules
const chalk = require('chalk');
//const boxen = require('boxen');

//include dynamic alternate display module
const ora = require('ora');

//include the module for the display of magnified letters 
var figlet = require('figlet');

let country ="";
let year = "";

if (Array.isArray(args) && args.length >=1 ){
    // get the 1st parameter from the command line 
    if(args.length == 1 ){
        country = args[0];
        year = new Date().getFullYear(); //as no 2nd paramater then current year
    }else{ //get both country name & year as parameters from the command line
        country = args[0];
        year = args[1];
    }

    //console.log('country: '+ country);
    //console.log('year: '+ year);

    //include the module getting the country code from country name
    const countryList = require('country-list');

    //get the country code with country name
    //console.log(`${country} : ` + countryList.getCode(`${country}`));
    const countryCode = countryList.getCode(`${country}`);

    // include HTTP module
    const axios = require('axios').default;

    //get the list of holly dates from the country code
    async function getUser(url) {
        try {
            const response = await axios.get(url);
            //console.log( response.data);
            figlet(`For ${country}`, function(err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
            });

            setTimeout(() => {
                console.log(chalk.inverse.red.underline("\ncountry code:") + chalk.bgMagenta(response.data[0].countryCode ));
                
                let counter= 0;
                //for each hollydate
                response.data.forEach(element => {
                    //creates a space between the hollyday & its date, fowllowing the hollyday name length.
                    for (i=0 , space = " "; i < (30-element.localName.length); i++){
                        space += " ";
                    }
                    //alternative display for even & uneven lines
                    if ( counter%2 == 0){
                        console.log(chalk.cyan.underline.italic(element.localName) + space + chalk.blue.inverse(element.date))  ;
                    }else{
                        console.log(chalk.yellow.underline.italic(element.localName) + space + chalk.red.inverse(element.date))  ;
                    }
                    counter++;
                    
                });
            },100);

            
            //display the alternative text.
            let displayTitle = setTimeout(() => {
                //display the 1st message
                //const spinner = ora('Find the country code & hollidates ...').start();
                const spinner = ora(`For the country name '${country}' ... `).start();
                setTimeout(() => {
                    spinner.color = 'yellow';
                    spinner.text = `... we get the hollidates for the year ${year}.`;
                
                }, 2500);
                //clearTimeout(displayTitle);
            }, 500);
                
        
        } catch (error) {
            console.log(error);
            let errorCode= error.response.status;
            //errorCode = "500";
            console.log("Error code : " + errorCode);
            if(errorCode == "404"){
                console.log(`Country "${country}" not found.`);
            } else {
                let statustext = error.response.statusText;
                console.log(`error text : ${statustext}`);
            }
        }
        
    }

    getUser(`https://date.nager.at/api/v2/publicholidays/${year}/${countryCode}`);

} else {
    console.log("Missing country parameter. The command must be 'npx hollidates [country] [year]' (current year, by default).");
}

