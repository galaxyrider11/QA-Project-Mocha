let expect = require('chai').expect;
//const { beforeEach, afterEach, after, describe } = require('node:test');
let railway = require('../railway');

describe("Railway File", function() {
    before( function() {
        ukData = railway.readData('uk.json');
        errorData = railway.readData('in_error.json');
        simpleData = railway.readData('simpleton.json');
        ukRouteName = "West Coast Main Line";
        simpleRoute = simpleData.routes[0];
    });

    beforeEach( function() {

    });

    afterEach( function() {

    });

    after( function() {
        ukData = null;
        errorData = null;
        simpleData = null;
        ukRoute = null;
    });

    describe("readData()", function() {
        it("Should return type object if provided with proper JSON", function() {
            expect(railway.readData('simpleton.json')).to.be.a('object');
        });

        it("Should return type null if provided with improper JSON", function() {
            expect(railway.readData('in_error.json')).to.equal(null);
        });
        
        it("Should return the full object when provided with Simpleton.JSON", function() {
            expect(railway.readData('simpleton.json')).to.deep.equal(
                {
                    "networkName": "Simpleton Railway System",
                    "routes":[
                        {
                            "name" : "Simpleton",
                            "color" : "Red",
                            "stops": [ 
                                { 
                                  "stop": 1,
                                  "stationName": "Alphaville",
                                  "stationID": 1,
                                  "distanceToNext" : 25,
                                  "distanceToPrev" : null
                                },
                                { 
                                    "stop": 2,
                                    "stationName":"Betaford",
                                    "stationID" : 2,
                                    "distanceToNext" : 25,
                                    "distanceToPrev" : 25
                                },
                                { 
                                    "stop": 3,
                                    "stationName":"Gammaton",
                                    "stationID" : 3,
                                    "distanceToNext" : 25,
                                    "distanceToPrev" : 25
                                },
                                { 
                                    "stop": 4,
                                    "stationName":"Deltafield",
                                    "stationID" : 4,
                                    "distanceToNext" : 25,
                                    "distanceToPrev" : 25
                                },
                                { 
                                    "stop": 5,
                                    "stationName":"Epsilon",
                                    "stationID" : 5,
                                    "distanceToNext" : null,
                                    "distanceToPrev" : 25
                                }
                            ] 
                        }
                    ]
                }
            );
        });
    });

    describe("getNetworkName()", function() {
        it("Should return RailTrack2019 when provided with uk.json", function() {
            expect(railway.getNetworkName(ukData)).to.equal("RailTrack2019");
        });

        it("Should return null when provided with in_error.json", function() {
            expect(railway.getNetworkName(errorData)).to.equal(null);
        });
    });

    describe("getRoutes()", function() {
        it("Should return the routes object when provided with uk.json", function() {
            expect(railway.getRoutes(simpleData)).to.deep.equal(
                [{
                    "name" : "Simpleton",
                    "color" : "Red",
                    "stops": [ 
                        { 
                          "stop": 1,
                          "stationName": "Alphaville",
                          "stationID": 1,
                          "distanceToNext" : 25,
                          "distanceToPrev" : null
                        },
                        { 
                            "stop": 2,
                            "stationName":"Betaford",
                            "stationID" : 2,
                            "distanceToNext" : 25,
                            "distanceToPrev" : 25
                        },
                        { 
                            "stop": 3,
                            "stationName":"Gammaton",
                            "stationID" : 3,
                            "distanceToNext" : 25,
                            "distanceToPrev" : 25
                        },
                        { 
                            "stop": 4,
                            "stationName":"Deltafield",
                            "stationID" : 4,
                            "distanceToNext" : 25,
                            "distanceToPrev" : 25
                        },
                        { 
                            "stop": 5,
                            "stationName":"Epsilon",
                            "stationID" : 5,
                            "distanceToNext" : null,
                            "distanceToPrev" : 25
                        }
                    ] 
                }]
            );
        });

        it("Should return null when provided with in_error.json", function() {
            expect(railway.getRoutes(errorData)).to.equal(null);
        });
    });

    describe("getRouteNames()", function() {
        it("Should return an array with the correct 14 route names when provided with uk.json", function() {
            expect(railway.getRouteNames(ukData)).to.deep.equal(['East Coast Main Line', 
                                                           'West Coast Main Line', 
                                                           'Great Western Railway',
                                                           'Network South West', 
                                                           'South Western Main Line',
                                                           'Cherwell Valley Line', 
                                                           'Great eastern main line', 
                                                           'High Speed 1', 
                                                           'Midland Main Line', 
                                                           'Wales Main Line', 
                                                           'Central Wales Line', 
                                                           'West Scotland Line', 
                                                           'Edinburgh main line', 
                                                           'Glasgow-Edinburgh']);
        });

        it("Should return an empty array when provided with in_error.json", function() {
            expect(railway.getRouteNames(errorData)).to.deep.equal([]);
        });
    });

    describe("routeNamesToString()", function() {
        it("Should return the array of route names converted to a string", function() {
            expect(railway.routeNamesToString(ukData)).to.equal(
                "East Coast Main Line,\n"+
                "West Coast Main Line,\n"+
                "Great Western Railway,\n"+
                "Network South West,\n"+
                "South Western Main Line,\n"+
                "Cherwell Valley Line,\n"+
                "Great eastern main line,\n"+
                "High Speed 1,\n"+
                "Midland Main Line,\n"+
                "Wales Main Line,\n"+
                "Central Wales Line,\n"+
                "West Scotland Line,\n"+
                "Edinburgh main line,\n"+
                "Glasgow-Edinburgh"
            );
        });

        it("Should return null when provided with in_error.json", function() {
            expect(railway.routeNamesToString(errorData)).to.equal('');
        });
    });

    describe("getRoute()", function() {
        it("Should return the West Coast Main route object when provided with uk.json", function() {
            expect(railway.getRoute(ukData, ukRouteName)).to.deep.equal(
                {
                    "name" : "West Coast Main Line",
                    "color" : "blue",
                    "stops" : [ 
                                { 
                                  "stop": 1,
                                  "stationName": "London",
                                  "stationID": 1,
                                  "distanceToNext" : 60,
                                  "distanceToPrev" : null
                                },
                                {
                                    "stop" : 2,
                                    "stationName" : "St Albans",
                                    "stationID": 100,
                                    "distanceToNext": 70,
                                    "distanceToPrev": 60
                                },
                                {
                                    "stop" : 3,
                                    "stationName" : "Northampton",
                                    "stationID": 54,
                                    "distanceToNext": 65,
                                    "distanceToPrev" : 70
                                },
                                { 
                                  "stop": 4,
                                  "stationName": "Birmingham",
                                  "stationID": 8,
                                  "distanceToNext" : 70,
                                  "distanceToPrev" : 65
                                },
                                { 
                                  "stop": 5,
                                  "stationName": "Wrexham",
                                  "stationID": 9,
                                  "distanceToNext" : 40,
                                  "distanceToPrev" : 70
                                },
                                { 
                                  "stop": 6,
                                  "stationName": "Liverpool",
                                  "stationID": 10,
                                  "distanceToNext" : 35,
                                  "distanceToPrev" : 40
                                },
                                { 
                                  "stop": 7,
                                  "stationName": "Manchester",
                                  "stationID": 11,
                                  "distanceToNext" : 50,
                                  "distanceToPrev" : 35
                                },
                                { 
                                  "stop": 8,
                                  "stationName": "Lancaster",
                                  "stationID": 12,
                                  "distanceToNext" : 60,
                                  "distanceToPrev" : 50
                                },
                                { 
                                  "stop": 9,
                                  "stationName": "Kendall",
                                  "stationID": 13,
                                  "distanceToNext" : 75,
                                  "distanceToPrev" : 60
                                },
                                { 
                                  "stop": 10,
                                  "stationName": "Carlisle",
                                  "stationID": 14,
                                  "distanceToNext" : 110,
                                  "distanceToPrev" : 75
                                },
                                { 
                                  "stop": 11,
                                  "stationName": "Glasgow",
                                  "stationID": 15,
                                  "distanceToNext" : null,
                                  "distanceToPrev" : 110
                                }
                            ]
                }
            );
        });

        it("Should return null when provided with in_error.json", function() {
            expect(railway.getRoute(errorData, ukRouteName)).to.equal(null);
        });
    });


    describe("routeDistance()", function() {
        it("Should return 100 when provided with simpleton.json", function() {
            expect(railway.routeDistance(simpleRoute)).to.equal(100);
        });

        it("Should return '' when provided with an empty route", function() {
            expect(railway.routeDistance(errorData)).to.equal('');
        });
    });

    describe("routeSummary()", function() {
        it("Should return the string route summary when provided with uk.json", function() {
            expect(railway.routeSummary(ukData)).to.equal(
                "Routes Summary\n"+
                "========================\n"+
                "East Coast Main Line     -    London         to  Edinburgh       -   500 miles\n"+
                "West Coast Main Line     -    London         to  Glasgow         -   635 miles\n"+
                "Great Western Railway    -    London         to  Fishguard       -   325 miles\n"+
                "Network South West       -    Birmingham     to  Truro           -   345 miles\n"+
                "South Western Main Line  -    London         to  Plymouth        -   245 miles\n"+
                "Cherwell Valley Line     -    Reading        to  Birmingham      -   125 miles\n"+
                "Great eastern main line  -    London         to  Kings Lynn      -   170 miles\n"+
                "High Speed 1             -    London         to  Paris           -   295 miles\n"+
                "Midland Main Line        -    Birmingham     to  York            -   240 miles\n"+
                "Wales Main Line          -    Cardiff        to  Holyhead        -   235 miles\n"+
                "Central Wales Line       -    Cardiff        to  Aberystwyth     -   175 miles\n"+
                "West Scotland Line       -    Stranraer      to  Fort William    -   270 miles\n"+
                "Edinburgh main line      -    Edinburgh      to  John O'Groats   -   323 miles\n"+
                "Glasgow-Edinburgh        -    Stranraer      to  Edinburgh       -   185 miles\n"
                );
        });

        it("Should return an empty string when provided with in_error.json", function() {
            expect(railway.routeSummary(errorData)).to.equal('');
        });
    });

    describe("sortRoutesByName()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("sortRoutesByLength()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("findLongestRoute()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("totalStations()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("findRoute()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("routeToString()", function() {
        it("Should do something", function() {
            expect();
        });

        it("Should do something", function() {
            expect();
        });
    });
});