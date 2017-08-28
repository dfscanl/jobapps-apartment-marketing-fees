const _ = require('lodash');
const moment = require('moment');
const numeral = require('numeral');

const getMarketingSources =
    guestCards => _.uniq(guestCards.map(guestCard => guestCard.marketing_source));

const makeMarketingSourceObjects =
    marketingSources => marketingSources.map((source) => {
        const newSourceObject = { name: source };

        return newSourceObject;
    });

const getTotalLeads = (marketingSourceObjects, guestCards) => {
    marketingSourceObjects.forEach((marketingSource) => {
        marketingSource.totalLeads = guestCards.filter(
            guestCard => guestCard.marketing_source === marketingSource.name
        ).length;
    });
};

const marketingSourcesWithKnownCostStructures = [{
    marketingSource: 'Apartment Guide',
    calculateTotalCost: () => 495 * 3,
    calculateCostPerLead: numberOfLeads => (495 * 3) / numberOfLeads
}, {
    marketingSource: 'Apartments.com',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 295 * numberOfSignedLeases,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) =>
        (295 * numberOfSignedLeases) / numberOfLeads
}, {
    marketingSource: 'Rent.com',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) =>
        Math.max(595, 595 * 0.5 * numberOfSignedLeases),
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) =>
        Math.max(595, 595 * 0.5 * numberOfSignedLeases) / numberOfLeads
}, {
    marketingSource: 'For Rent',
    calculateTotalCost: numberOfLeads => (195 * 3) + (25 * numberOfLeads),
    calculateCostPerLead: numberOfLeads => ((195 * 3) + (25 * numberOfLeads)) / numberOfLeads
}, {
    marketingSource: 'Craigslist.com',
    calculateTotalCost: () => 0,
    calculateCostPerLead: () => 0
}, {
    marketingSource: 'Resident Referral',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 500 * numberOfSignedLeases,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) =>
        (500 * numberOfSignedLeases) / numberOfLeads
}];

const getSignedLeases = (marketingSourceObjects, guestCards) => {
    marketingSourceObjects.forEach((marketingSource) => {
        marketingSource.signedLeases = guestCards.filter(
            guestCard => guestCard.marketing_source === marketingSource.name
                && guestCard.lease_signed !== null
        ).length;
    });
};

const getQuarterFromDate = (date) => {
    const year = date.year();
    const quarter = date.utc().quarter();

    return `Q${ quarter } ${ year }`;
};

const addCardToQuarterAtDate = (quarterObjects, guestCard, dateToCheck) => {
    const quarterFromDate = getQuarterFromDate(moment(dateToCheck));

    if (quarterObjects[quarterFromDate] === undefined) {
        quarterObjects[quarterFromDate] = {};
    }

    if (quarterObjects[quarterFromDate][guestCard.marketing_source] === undefined) {
        quarterObjects[quarterFromDate][guestCard.marketing_source] = [];
    }

    quarterObjects[quarterFromDate][guestCard.marketing_source].push(guestCard);
};

const createQuarterObjects = (guestCards) => {
    const quarterObjects = {};

    guestCards.forEach((guestCard) => {
        addCardToQuarterAtDate(quarterObjects, guestCard, guestCard.first_seen);

        if (getQuarterFromDate(moment(guestCard.first_seen))
            !== getQuarterFromDate(moment(guestCard.lease_signed))) {
            addCardToQuarterAtDate(quarterObjects, guestCard, guestCard.lease_signed);
        }
    });

    return quarterObjects;
};

const analyze = (guestCards) => {
    const quarterObjects = createQuarterObjects(guestCards);
    const quarters = Object.keys(quarterObjects);

    return quarters.map((quarter) => {
        const sources = quarterObjects[quarter];
        const sourcesInQuarter = Object.keys(sources);
        const sourceObjects = makeMarketingSourceObjects(sourcesInQuarter);

        const sourceTotals = sourcesInQuarter
            .filter(source => marketingSourcesWithKnownCostStructures
                .find(marketingSource => source === marketingSource.marketingSource))
            .map((source) => {
                const sourceTotal = { name: source };
                const costStructure = marketingSourcesWithKnownCostStructures
                    .find(marketingSource => source === marketingSource.marketingSource);

                const cardsFromSourceInQuarter = sources[source];
                getTotalLeads(sourceObjects, cardsFromSourceInQuarter);
                getSignedLeases(sourceObjects, cardsFromSourceInQuarter);
                const sourceInfo = sourceObjects.find(obj => obj.name === source);

                sourceTotal.totalLeads = sourceInfo.totalLeads;
                sourceTotal.signedLeases = sourceInfo.signedLeases;
                sourceTotal.totalCost = costStructure
                    .calculateTotalCost(sourceTotal.totalLeads, sourceTotal.signedLeases);
                sourceTotal.averageCost = costStructure
                    .calculateCostPerLead(sourceTotal.totalLeads, sourceTotal.signedLeases);

                return sourceTotal;
            });

        sourceTotals.sort((a, b) => a.averageCost - b.averageCost);
        const totalStrings = sourceTotals.map((source, index) => `\n${ index + 1 }. ${ source.name } - total leads: ${ source.totalLeads }, signed leases: ${ source.signedLeases }, total cost: ${ numeral(source.totalCost).format('$0,0.00') }, avg cost per lead: ${ numeral(source.averageCost).format('$0,0.00') }`);

        const stringLeadIn = `${ quarter }:\n`;
        const responseString = totalStrings
            .reduce((response, currentString) => response + currentString, stringLeadIn);

        return responseString;
    });
};

module.exports.analyze = analyze;
module.exports.getMarketingSources = getMarketingSources;
module.exports.makeMarketingSourceObjects = makeMarketingSourceObjects;
module.exports.getTotalLeads = getTotalLeads;
module.exports.getSignedLeases = getSignedLeases;
module.exports.marketingSourcesWithKnownCostStructures = marketingSourcesWithKnownCostStructures;
module.exports.createQuarterObjects = createQuarterObjects;
