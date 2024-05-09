/**
 * Class:       CS 253 (Project 2)
 * @author      Andrew Scott
 * @author      Mark Holliday
 * @author      Bek Tursyngazy
 * @author      Brandon Owen
 * @date        10/25/2023
 * @file        This file reads in a json file representing a railway network data structure.
 *              This program has the functionality to: build a graph based on the railway network
 *              data structure read in using link objects and station objects, create a journey object
 *              based on the path taken through the graph, clone that journey object, increase the distance
 *              of the journey object, get a text representation of the journey object, determine the best
 *              possible routes to take from a specified origin to the destination, sort the routes found,
 *              and then display those possible routes.
 **/

var railways = require("./railway.js");
var exports = module.exports = {};
exports.Station = Station;
exports.Link = Link;
exports.Journey = Journey;
exports.sortRoutes = sortRoutes;
exports.network = network;
exports.getBestRoute = getBestRoute;
exports.doGetBestRoutes = doGetBestRoutes;
exports.displayRoutes = displayRoutes;
exports.main = main;

/**
 * Holds data for a station. On a graph this will represent the nodes of the graph.
 * Each station hold an array of links to other stations (these represent the edges 
 * of a graph).
 * @param stationID {number} The id number of the station (each station has a unique ID).
 * @param stationName {string} The name of the station.
 **/
function Station(stationID, stationName){

    this.stationName = stationName;
    this.stationID = stationID;
    this.links = [];
 }//end station
 
/**
*This function adds a link to a station.
*@param {object} link The link object representing a link to another station.
**/
Station.prototype.addLink = function(link){
        this.links.push(link);
}

/**
 * Forms the links between one station and the next. This object is what allows 
 * the stations to become notes on a graph. Essentially in graph theory  the
 * stations are the nodes and the Link objects are the edges.
 **/
 function Link(routeName, station, distance){
     this.routeName = routeName;
     this.distance = distance;
     this.station = station;
     this.linkName = station.stationName;
 }//end link

/**
 * This object defines a journey on the railway network that a passenger may take from
 * one location to another.A journey may pass though multiple routes or be on a single
 * route. The object is useful in building up journeys when traversing the graph to
 * discover what paths can be taken from the origin to the destination.
 * @param {Array} stations An array of all the stations on this journey (including the
 *                          origin and destination)
 * @param {number} distance The total distance of the journey in miles.
 * @param {string} text A textual description of the journey including where to get on and
 *                          off including any changes to other lines.
 * @param {boolean} success When true this journey object was successful in reaching the
 *                          destination station.
 * @param {number} changes The number of changes to different routes needed to complete
 *                          the journey.
 *
 */
function Journey(stations = [], distance = 0, text = '', success = false, changes = 0) {
    this.stations = stations;
    this.distance = distance; 
    this.text = text;
    this.success = success;
    this.changes = changes;
    /**
     * Given the state of the current journey creates a shallow copy of this object and
     * another instance of Journey
     * @returns {Object} the shallow copy of the Journey object passed in
     */
    this.copy = function() {
        let newJourney = Object.create(this);
        newJourney.stations = [...this.stations];
        newJourney.changes = this.changes;
        newJourney.copy = this.copy;
        newJourney.incDistance = this.incDistance;
        return newJourney;
    };
    /**
     * This function increments the distance of this journey object by the specified
     * number of miles. If the parameter is not a number or not positive, the distance
     * is not altered.
     * @param {number} amt the number of miles to increment the total distance by
     */
    this.incDistance = function(amt) {
        if(typeof(amt) === "number" && amt > 0) {
            this.distance += amt;
        }
    };
    /**
     * Using the data stored in the properties of the Journey object this function
     * generates and displays a journey report outlining the details of one journey.
     * @returns {string} the report representing the Journey object
     */
    this.report = function() {
        let routeString = `Route Summary\n==============\n${this.text}\n\n` +
            `Total Distance: ${this.distance}\nChanges: ${this.changes}\n` +
            `Passing Through: `;
        for (let station of this.stations) {
            routeString += station.stationName + ", ";
        }
        return routeString.slice(0, -2); //Removes the extra comma at the end
    };
 }//end Journey

/**
 * Sorts the array of routes first by the number of changes, then the total distance.
 * @param {Array} routesFound The array of possible journeys that are found
 */
function sortRoutes(routesFound) { //Sorts by changes and then distance
    routesFound.sort((a,b) => {
        return a.changes - b.changes || a.distance - b.distance;
    });
}//end sortRoutes

/**
 * Converts the railway network data structure from Project One into a graph that can
 * be traversed to ascertain the best route between two stations.
 * @param {string} filename the name of the file from which to turn the railway network into a graph
 * @returns the graphical representation of the railway network data
 */
function network(filename) {
    let data = railways.readData(filename);
    let graph = {};
    let lastStation = null;
    let lastDistance = null;

    for (let route of data.routes) {
        for (let stop of route.stops) {
            let station = new Station(stop.stationID, stop.stationName);
            //Add the station if it's not in the graph
            if(!(stop.stationName.toLowerCase() in graph)) { 
                graph[stop.stationName.toLowerCase()] = station;
            }
            //After station has been added to the graph, reassign it to that station object
            station = graph[stop.stationName.toLowerCase()];
            if (stop.distanceToPrev != null) { //Add the links to each station object
                let forwardLink = new Link(route.name, station, lastDistance);
                let backwardLink = new Link(route.name, lastStation, stop.distanceToPrev);
                //Adds a link from the previous station to this station
                //Ensuring it is lowercase to prevent case-sensitive errors
                graph[lastStation.stationName.toLowerCase()].links.push(forwardLink);
                //Adds a link from this station to the previous station
                //Ensuring it is lowercase to prevent case-sensitive errors
                graph[station.stationName.toLowerCase()].links.push(backwardLink);
            }
            lastStation = station; //Used in the next iteration to check if we have changed routes
            lastDistance = stop.distanceToNext; //Used in the next iteration when adding a link
        }
    }
    return graph;
}//end network

/**
 * This function finds the origin and destination stations in the graph. Then builds
 * an empty array of possible routes and pass this data to the recursive function
 * doGetBestRoutes. Once this function is complete the array of possible routes will
 * be populated and will need sorting to get the n number of results to return.
 * The routes should be sorted first by the number of changes (lowest is best). If
 * changes are equal between journeys then distance is used to differentiate them.
 * @param {Object} graph the graphical representation of the railway network data
 * @param {string} origin the station name of the origin for the route finding process
 * @param {string} destination the station name of the destination for the route finding process
 * @param {number} max_result the number of possible routes found to output
 * @returns the sorted possible routes found, with a maximum output specified
 */
function getBestRoute(graph, origin, destination, max_results) {
    let routesFound = [];
    let journey = new Journey();
    let routeName = '';

    doGetBestRoutes(graph, graph[origin], graph[destination], journey, routesFound, routeName);
    sortRoutes(routesFound);
    return routesFound.slice(0, max_results); //Returns only the amount of arrays deictated by max_result
}//end getBestRoute

/**
 * This function represents the core of the route-finding algorithm and is used so that
 * starting from the origin station it explores each station of each link until either
 * it runs out of stations you have not visited or it finds the destination station. As
 * it reaches each station it mutates the journey object and then clones it for each link > 1
 * at the current station.
 * @param {Object} graph the graphical representation of the railway network data
 * @param {Object} origin the Station object that will be the origin of the route finding process
 * @param {Object} destination the Station object that will be the destination of the route finding process
 * @param {Object} journey the journey object to be mutated and cloned to find the routes
 * @param {Array} routesFound the routes that successfully make it to the destination station
 * @param {string} routeName the name of the route of the previous Station object (blank initially)
 */
function doGetBestRoutes(graph, origin, destination, journey, routesFound, routeName) {
    journey.stations.push(origin);

    if (origin === destination) { //If we have found our destination, we are done with this journey
        journey.text += `Arrive at ${destination.stationName}`;
        journey.success = true;
        routesFound.push(journey);
    } else { //If not, we continuing visiting unvisited stations for this journey
        for (let link of origin.links) {
            if (!journey.stations.includes(link.station)) {
                let newJourney = journey.copy(); //This ensures each journey has its own reference to mutate
                if (routeName === '') { //If the routename is blank, that means we have just begun
                    newJourney.text = `Embark at ${origin.stationName} on ${link.routeName}\n`;
                } else if (link.routeName !== routeName) { //Only update the journey text at a route change
                    newJourney.text += `At ${origin.stationName} change to ${link.routeName}\n`;
                    newJourney.changes++;
                }
                newJourney.incDistance(link.distance);
                doGetBestRoutes(graph, link.station, destination, newJourney, routesFound, link.routeName);
            }
        }
    }
}//end doGetBestRoutes

/**
 * This function will display the journeys found by being passed an array of completed
 * journeys. It iterates through them and displays the number of routes found and the route
 * summary for each journey. The amount of journeys passed is dictated max_result, which is
 * provided by the user at the command line upon invocation
 * @param {Array} journeysFound the successful journeys found by the doGetBestRoutes function 
 */
function displayRoutes(journeysFound) {
    console.log(`\nRoutes found: ${journeysFound.length}`);
    for (let i = 0; i < journeysFound.length; i++) {
        console.log(`${i+1}:`); //Add one to i since it starts at 0, and our counting starts at 1
        console.log(`${journeysFound[i].report()}\n`);
    }
}//end displayRoutes

/**
 * The main function will receive four command line parameters: the filename,
 * the name of the origin station, the name of the destination station, and the maximum
 * number of results to return. If the parameters are invalid, this function
 * informs the user with appropriate errors.
 * @param {string} filename the name of the file with the railway data structure
 * @param {string} start the name of the origin station
 * @param {string} end the name of the destination station
 * @param {string} numResults the maximum number of results to return
 */
function main(filename, start, end, max_results) {
    let graph = network(filename); //Create the graph
    start = start.toLowerCase(); //Convert station names to lowercase to prevent case-sensitive errors
    end = end.toLowerCase();

    if(start in graph && end in graph) { //If both station names exist in the graph
        let routesFound = getBestRoute(graph, start, end, max_results); //We attempt to found routes
        displayRoutes(routesFound);
    } else { //If not, we print errors depending on which station was mispelled (or doesn't exist)
        console.log("\nOne or more stations cannot be found on this network");
        if (!(start in graph) && !(end in graph)) {
            console.log("Please check the spelling of the origin and destination station\n")
        } else if (!(start in graph)){
            console.log("Please check the spelling of the origin station\n");
        } else {
            console.log("Please check the spelling of the destination station\n");
        }
    }
}//end main

let filename = process.argv[2];     //Assigns the 2nd argument provided at the console (filename)
let start = process.argv[3];        //Assigns the 3rd argument provided at the console (start)
let end = process.argv[4];          //Assigns the 4th argument provided at the console (end)
let max_results = process.argv[5];  //Assigns the 5th argument provided at the console (max_results)
let error = false;                  //We assume there is not initially an error
let errorMessage = "ERROR! \tUsage: node network.js <data set> <origin> <destination> <max results>\n";

//If the filename is empty, there is an error
if (typeof(filename) !== 'string' || filename - 0 || !filename.includes('.json')) {
    errorMessage += "\tFile provided must be a JSON\n";
    error = true;
}
//If origin station is not a string, there is an error
//Numbers are converted to strings by JavaScript, so the second part forces it to stay a number
if (typeof(start) !== 'string' || start - 0) {
    error = true;
    errorMessage += "\tOrigin station must be a string\n";
}
//If destination station is not a string, there is an error
//Numbers are converted to strings by JavaScript, so the second part forces it to stay a number
if (typeof(end) !== 'string' || end - 0) {
    error = true;
    errorMessage += "\tDestination station must be a string\n";
}
//If max_results is not a number, there is an error
if (isNaN(parseInt(max_results))) {
    error = true;
    errorMessage += "\tMax results must be a number\n";
} 
//If there is an error, print the error message
if (error) {
    console.log(errorMessage);
} else { //If not, call the main function to begin the program
    try {
        main(filename, start, end, max_results);
    } catch {
    }
}