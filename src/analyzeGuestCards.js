const _ = require('lodash');
const moment = require('moment');

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
        Math.max(595, 0.5 + numberOfSignedLeases),
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) =>
        Math.max(595, 0.5 + numberOfSignedLeases) / numberOfLeads
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
    console.log(guestCards.length);

    return [];
};

module.exports.analyze = analyze;
module.exports.getMarketingSources = getMarketingSources;
module.exports.makeMarketingSourceObjects = makeMarketingSourceObjects;
module.exports.getTotalLeads = getTotalLeads;
module.exports.getSignedLeases = getSignedLeases;
module.exports.marketingSourcesWithKnownCostStructures = marketingSourcesWithKnownCostStructures;
module.exports.createQuarterObjects = createQuarterObjects;
