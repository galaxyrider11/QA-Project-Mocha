let expect = require('chai').expect;
//const { beforeEach, afterEach, after, describe } = require('node:test');
let network = require('../network');

describe("Network File", function() {
    before( function() {
        alphaStation = new network.Station(1, "Alphaville");
        betaStation = new network.Station(2, "Betaford");
        gammaStation = new network.Station(3, "Gammaton");
        deltaStation = new network.Station(4, "Deltafield");
        epsiStation = new network.Station(5, "Epsilon");
        alphaLink = new network.Link("Simpleton", alphaStation, 25);
        betaLink = new network.Link("Simpleton", betaStation, 25);
        gammaLink = new network.Link("Simpleton", gammaStation, 25);
        deltaLink = new network.Link("Simpleton", deltaStation, 25);
        epsiLink = new network.Link("Simpleton", epsiStation, 25);
        blankJourney = new network.Journey();
        filledJourney = new network.Journey([alphaStation], 25, "text", true, 1);
        clonedJourney = filledJourney.copy();
        modifiedJourney = filledJourney.copy();
        modifiedJourney.changes = 2;
        graph = network.network("simpleton.json");
        routesFound = network.getBestRoute(graph, "alphaville", "epsilon", 1);
        //console.log(network.network("simpleton.json"));
    });

    beforeEach( function() {   
    });

    afterEach( function() {
    });

    after( function() {
    });

    describe("Station", function() {
        it("Should contain the Alphaville Station object when provided with 1, Alphaville", function() {
            expect(alphaStation).to.deep.include(
                {"stationName": "Alphaville", "stationID": 1, "links": []}
            );
        });

        it("Should contain the Betaford Station object when provided with 2, Betaford", function() {
            expect(betaStation).to.deep.include(
                {"stationName": "Betaford", "stationID": 2, "links": []}
            );
        });

        it("Should contain the Deltafield Station object when provided with 3, Gammaton", function() {
            expect(gammaStation).to.deep.include(
                {"stationName": "Gammaton", "stationID": 3, "links": []}
            );
        });

        it("Should contain the Gammaton Station object when provided with 4, Deltafield", function() {
            expect(deltaStation).to.deep.include(
                {"stationName": "Deltafield", "stationID": 4, "links": []}
            );
        });

        it("Should contain the Epsilon Station object when provided with 5, Epsilon", function() {
            expect(epsiStation).to.deep.include(
                {"stationName": "Epsilon", "stationID": 5, "links": []}
            );
        });

        it("Should do something", function() {
            expect();
        });
    });

    describe("Station Prototype", function() {
        it("Should add the link for the Betaford station", function() {
            alphaStation.addLink(betaLink);
            expect(alphaStation.links).to.be.an("array").that.deep.equals(
                [{
                    "routeName": "Simpleton", 
                    "distance": 25, 
                    "station": betaStation, 
                    "linkName": "Betaford"
                }]
            );
        });
    });

    describe("Link", function() {
        it("Should equal the Alphaville link when provided with Alphaville Station details", function() {
            expect(alphaLink).to.be.an("object").that.deep.equals(
                {
                    "routeName": "Simpleton", 
                    "distance": 25, 
                    "station": alphaStation, 
                    "linkName": "Alphaville"
                }
            );
        });
    });

    describe("Journey", function() {
        it("Should return the default journey when called without any paramaters", function() {
            expect(blankJourney).to.be.an("object").that.deep.includes(
                {
                    "stations": [],
                    "distance": 0,
                    "text": "",
                    "success": false,
                    "changes": 0
                }
            );
        });

        it("Should return the correct journey when called with provided paramaters", function() {
            expect(filledJourney).to.be.an("object").that.deep.includes(
                {
                    "stations": [alphaStation],
                    "distance": 25,
                    "text": "text",
                    "success": true,
                    "changes": 1
                }
            );
        });
    });

    describe("Journey.copy", function() {
        it("Should verify that the cloned journey is initially the same as the original journey", function() {
            expect(filledJourney).to.deep.equal(clonedJourney);
        });

        it("Should verify that the cloned journey is no longer the same as the original journey after changing an attribute", function() {
            expect(filledJourney).to.not.deep.equal(modifiedJourney);
        });
    });

    describe("Journey.incDistance", function() {
        it("Should return 27 when adding 2 to the distance (originally 25)", function() {
            filledJourney.incDistance(2);
            expect(filledJourney.distance).to.equal(27);
        });
    });

    describe("Journey.report", function() {
        it("Should return the correct route summary when provided with a journey", function() {
            graph = network.network("simpleton.json");
            routesFound = network.getBestRoute(graph, "alphaville", "epsilon", 1);
            expect(routesFound[0].report()).to.equal(
                `Route Summary\n==============\n`+
                `Embark at Alphaville on Simpleton\n`+
                `Arrive at Epsilon\n\n`+
                `Total Distance: 100\nChanges: 0\n`+
                `Passing Through: Alphaville, Betaford, Gammaton, Deltafield, Epsilon`
            );
        });
    });

    describe("sortRoutes", function() {
        it("Should do something", function() {
            expect();
        });
    });

    describe("network", function() {
        it("Should return Simpleton graph when provided with simpleton.json", function() {
            expect(network.network("simpleton.json")).to.have.nested.property('alphaville.links');
        });

        it("Should have the property alphaville", function() {
            expect(graph).to.have.property("alphaville");
        });
    });

    describe("getBestRoute", function() {
        it("Should do something", function() {
            expect();
        });
    });

    describe("doGetBestRoutes", function() {
        it("Should do something", function() {
            expect();
        });
    });

    describe("displayRoutes", function() {
        it("Should do something", function() {
            expect();
        });
    });

    describe("main", function() {
        it("Should do something", function() {
            expect();
        });
    });


});