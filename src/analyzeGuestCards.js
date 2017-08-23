const _ = require('lodash');

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
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 495 * 3,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => 495 * 3 / numberOfLeads
}, {
    marketingSource: 'Apartments.com',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 295 * numberOfSignedLeases,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => 295 * numberOfSignedLeases / numberOfLeads
}, {
    marketingSource: 'Rent.com',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => max(595, .5 + numberOfSignedLeases),
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => max(595, .5 + numberOfSignedLeases) / numberOfLeads
}, {
    marketingSource: 'For Rent',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 195 * 3 + (25 * numberOfLeads),
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => (195 * 3 + (25 * numberOfLeads)) / numberOfLeads
}, {
    marketingSource: 'Craigslist.com',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 0,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => 0
}, {
    marketingSource: 'Resident Referral',
    calculateTotalCost: (numberOfLeads, numberOfSignedLeases) => 500 * numberOfSignedLeases,
    calculateCostPerLead: (numberOfLeads, numberOfSignedLeases) => 500 * numberOfSignedLeases / numberOfLeads
];

const getSignedLeases = (marketingSourceObjects, guestCards) => {
    marketingSourceObjects.forEach((marketingSource) => {
        marketingSource.signedLeases = guestCards.filter(
            guestCard => guestCard.marketing_source === marketingSource.name
                && guestCard.lease_signed !== null
        ).length;
    });
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
