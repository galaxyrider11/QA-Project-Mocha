/**
 * @author      Andrew Scott
 * @author      Mark Holliday
 * @author      Bek Tursyngazy
 * @author      Brandon Owen
 * @date        09/10/23
 * @file:       Test our functions against the pre-created railway network
 * Class:       CS 253
 * Professor:   Professor Holliday
 */

fs = require('fs');
var exports = module.exports = {};
exports.readData = readData;
exports.getNetworkName = getNetworkName;
exports.getRoutes = getRoutes;
exports.getRouteNames = getRouteNames;
exports.routeNamesToString = routeNamesToString;
exports.routeSummary = routeSummary;
exports.getRoute = getRoute;
exports.totalStations = totalStations;
exports.routeToString = routeToString;
exports.routeDistance = routeDistance;
exports.findLongestRoute = findLongestRoute;
exports.sortRoutesByName = sortRoutesByName;
exports.sortRoutesByLength = sortRoutesByLength;

/** 
 * (O) Reads the JSON file and returns it if it doesn't run into an error
 * 
 * @param {JSON} file - The JSON file we want to process
 * @returns {Object} - The JavaScript object that we parse
 * 
 */
function readData(file) { 
    try {
        return JSON.parse(fs.readFileSync(file,`utf-8`));
    } catch {
        console.log('\nERROR: \tThe JSON file is not properly formatted\n');
        return null;
    }
}

/**
 * (O) Returns the name of the railway network
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @returns {String} - The Name of the railway network
 * 
 */
function getNetworkName(data) { 
    try {
        return data.networkName;
    } catch {
        console.log('\nERROR: \tUnable to extract a network name from null data');
        return null;
    }
}

/**
 * (O) Returns the routes (as an object)
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @returns {Object} - The routes
 * 
 */
function getRoutes(data) { 
    try {
        return data.routes;
    } catch {
        return null;
    }
}

/**
 * (O) Returns the names of the routes (as an array of strings)
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @returns {Array} - The names of the routes as an array of strings
 * 
 */
function getRouteNames(data) { 
    let routeTable = [];

    try {
        for (let route of data.routes) {
            routeTable.push(route.name);
        };
    } catch {}
    return routeTable;
}

/**
 * (O) Returns the names of the routes (as a string)
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @returns {String} - The names of the routes as a comma-separated string
 * 
 */
function routeNamesToString(data) {
    return getRouteNames(data).join(',\n');
}

/**
 * (O) Returns the route if found
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @param {String} line - The string provided in the code to compare to
 * @returns {Object} - The matching route if found
 * 
 */
function getRoute(data, line) {
    try {
        for (let route of data.routes) {
            if (route.name == line) {
                return route;
            }
        }
    } catch {
        return null;
    }
}

/**
 * (BT) Finds total route distance
 * 
 * @param {object} data - The parsed data from the JSON file
 * @param {Array} data.stops - An Array of stop objects of the route
 * @param {number} data.stops[].distanceToNext - The distance from the current stop to the next stop in miles
 * @returns {number} The total distance of the route in miles
 * 
 */
function routeDistance(data) {
    let total_distance = 0;
    //if distance is not null
    if (data == null) {
        return '';
    } else {
        for (let stop of data.stops){
            total_distance += stop.distanceToNext;
        }
        return total_distance;
    }
}

/** 
 * (BT) Creates a summary string for a list of routes
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @param {Array} data.routes - An Array of route objects
 * @param {String} data.routes[].name - The name of the route
 * @param {Array} data.routes[].stops - An Array of stops objects
 * @param {Object} data.routes[].stops[].stationName - The name of the station at the stop
 * @returns {string} A summary string containing information about the routes
 * 
 */
function routeSummary(data) {//ready to test
    try {
        let summaryString = 'Routes Summary\n========================\n';
        for (let route of data.routes) {
            summaryString += route.name.padEnd(25, ' ') + '-    ';
            summaryString += route.stops[0].stationName.padEnd(15, ' ') + 'to  ';
            summaryString += (//Split among two lines to meet Google's 80 char line length limit
                route.stops[route.stops.length-1].stationName.padEnd(16, ' ') + '-   ');
            summaryString += routeDistance(route) + ' miles\n';
        }
        return summaryString;
    } catch {
        return '';
    }
}

/**
 * (BT) Sorts the route name in a data object alphabetically, either in descending or ascending order 
 * 
 * @param {object} data - The parsed data from the JSON file
 * @param {boolean} [asc=false] - A boolean indicating whether to sort in ascending order (A-Z), setted false by default
 * 
 */
function sortRoutesByName(data, asc = false) {
    data.routes.sort((a,b) => {
        const a1 = a.name;
        const b1 = b.name; 
        if (asc) {
            return a1.localeCompare(b1);
        }
        else{
            return b1.localeCompare(a1);
        }
    });
}

/**
 * (BT) Sorts the route name in a data object alphabetically, either in descending or ascending order 
 * 
 * @param {object} data - The parsed data from the JSON file
 * @param {boolean} [asc=false] - A boolean indicating whether to sort in ascending order (A-Z), setted false by default
 * 
 */
function sortRoutesByLength(data, asc = false) {// apparently you need to do a-b lol points.sort(function(a, b){return b-a});
    data.routes.sort((a,b) => {
        const a1 = routeDistance(a);
        const b1 = routeDistance(b); 
        if (asc) {
            return a1 - b1;
        }
        else{
            return b1 - a1;
        }
    });
}

 /**
  * (BT) Finds and returns the longest route based on route length
  * 
  * @param {object} data - The parsed data from the JSON file
  * @param {boolean} [asc=false] - A boolean indicating whether to sort in ascending order (A-Z), setted false by default
  * @returns {object} - The longest route
  * 
  */
function findLongestRoute(data) {
    sortRoutesByLength(data, false);
    return data.routes[0];
}

/**
 * (BT) Finds and returns the total number of stations across all routes
 * 
 * @param {object} data - The parsed data from the JSON file
 * @returns {number} - The total number of stations
 * 
 */
function totalStations(data) {
    let ids = [];
    for (let route of data.routes){
        for (let stop of route.stops){
            if (!ids.includes(stop.stationID)){
                ids.push(stop.stationID)
            }
        }
    }
    return ids.length;
}

/**
 * (O) Takes two stops and determines if there is a direct route between them
 * 
 * @param {Object} data - The parsed data from the JSON file
 * @param {String} first - The name of the departure station
 * @param {String} last - The name of the destination station
 * @returns {String} - Either the route it finds, or "Route not found"
 * Works no matter the order in which the two stations are provided
 * 
 */
function findRoute(data, first, last) {
    let routeString = '';
    let distance = 0;
    let numStops = 0;
    let foundFirst = false
    let foundLast = false;

    //Outer loop that iterates through each line
    for (let route of data.routes) {
        //Resets the variables for each outer loop if it doesn't find a route
        if (!foundLast) {
            distance = 0;
            numStops = 0;
            foundFirst = false;
        }
        //Inner loop to iterate through each stop in the line
        for (let stop of route.stops) {
            //Begins the string to return if it finds either stop
            //Sets the foundFirst variable to true so this part of the string won't get added again
            //Split among multiple lines to meet Google's 80 char line length limit
            if ((!foundFirst) && 
                (stop.stationName == first || stop.stationName == last)) {
                    routeString = `Found: ${route.name}: ${stop.stationName} to `;
                    foundFirst = true;
            }
            //Adds the last half of the string to return if the other stop is found
            //Uses else if to ensure this isn't called immediately afetr the previous block
            //Sets the foundLast variable to true so this part of the string won't get added again
            //Split among multiple lines to meet Google's 80 char line length limit
            else if ((!foundLast) && 
                (stop.stationName == first || stop.stationName == last)) {
                    routeString +=
                        `${stop.stationName} ` +
                        `${numStops} stops and ` +
                        `${distance} miles\n`;
                    foundLast = true;
            }
            //This ensures it is only increasing the number of stops and distance if it hasn't found the last stop
            if (foundFirst && !foundLast) {
                numStops++;
                distance += stop.distanceToNext;
            }
        }
    }
    //Returns the full routeString only if it found a route
    return foundLast ? routeString : "Route not found\n";
}

/**
 * (BT & O) Iterates through the stops on the route and adds up the distance
 * 
 * @param {Object} route - The route provided to turn into a string
 * @returns {String} - Either the route as a string, or an empty string if no route was provided
 */
function routeToString(route) {
    //Only runs this code if the route supplied is not empty
    if (route != null) {
        let distance = 0; 
        let routeString = `ROUTE: ${route.name} (${route.color})\nSTATIONS:\n`;
        
        for (let stop of route.stops) {
            routeString += `${stop.stop} ${stop.stationName} ${distance} miles\n`;
            distance += stop.distanceToNext;
        }
        routeString += `Total Route Distance: ${distance} miles`
        return routeString;
    } else {
        return '';
    }
}

// function main (fileName){
//     let data = readData(fileName); // load the railway data structure from file.

//     if (data != null) {
//         // test route name
//         console.log("===TEST=1=NETWORK=NAME==="); 
//         console.log( getNetworkName(data) );

//         // test getting routes
//         console.log("\n===TEST=2=GETTING=ROUTES=ARRAY");
//         console.log(`There are ${getRoutes(data).length} routes on this network`);
//         console.log(`The type of the routes is ${typeof getRoutes(data)}`);
    
//         // test getting route names
//         console.log("\n===TEST=3=ROUTE=NAMES===");
//         console.log(getRouteNames(data));

//         // test getting route names formated as a String
//         console.log("\n===TEST=4=ROUTE=NAMES=TOSTRING===");
//         console.log(routeNamesToString(data));

//         // test getting data for one route
//         console.log("\n===TEST=5=GET=ROUTE===")
//         let route = getRoute(data, "West Coast Main Line");
//         if(route != null)
//             console.log(`Found: ${route.name}`);
//         else
//             console.log("Route not found");

//         // test route toString
//         console.log("\n===TEST=6=ROUTE=TO=STRING===");
//         console.log(routeToString(route));

//         // test route distance calculation
//         console.log("\n===TEST=7=ROUTE=DISTANCE===");
//         var dist = routeDistance(route);
//         console.log(`Distance of Line as calculated: ${routeDistance(route)}`);   

//         //T tst the routeSummay function
//         console.log("\n===TEST=8=ROUTE=SUMMARY===");
//         console.log(routeSummary(data));

//         // test sorting routes by name in ascending order
//         console.log("\n===TEST=9=SORT=ROUTE=BY=NAME===");
//         sortRoutesByName(data, true);
//         console.log(routeSummary(data));

//         // test sorting routes by name in descending order
//         console.log("\n===TEST=10=SORT=ROUTE=BY=NAME=(DESC)===");
//         sortRoutesByName(data);
//         console.log(routeSummary(data));

//         // test sorting in assending order
//         console.log("\n===TEST=11=SORT=ROUTE=BY=LENGTH=(ASC)===");
//         sortRoutesByLength(data, true);
//         console.log(routeSummary(data));
        
//         // test sorting in descending order
//         console.log("\n===TEST=12=SORT=ROUTE=BY=LENGTH=(DESC)===");
//         sortRoutesByLength(data, false);
//         console.log(routeSummary(data));
        
//         // test finding the longest route
//         console.log("\n===TEST=13=FIND=LONGEST=ROUTE===");
//         route = findLongestRoute(data);
//         console.log(`Longest route is: ${routeToString(route)}\n`);

//         // test routeDistance
//         console.log("\n===TEST=14=Total_Stations===");
//         //let numStations= totalStations(data);
//         console.log(`There are ${totalStations(data)} stations in this network.`);

//         // test finding route from to.
//         console.log("\n====(OPTIONAL) TEST=BONUS1=FIND=FROM=TO===");
//         //let routeFromTo = findRoute(data, "Cardiff","Reading");
//         console.log(`>>END>> ${findRoute(data, "Cardiff", "Reading")}`);
//     }
// }//end main

//Call the main function
// if (require.main === module) {
//     main(process.argv[2]);
// };