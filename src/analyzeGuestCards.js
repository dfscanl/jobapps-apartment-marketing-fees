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

const marketingSourcesWithKnownCostStructures = [
    'Apartment Guide',
    'Apartments.com',
    'Rent.com',
    'For Rent',
    'Craigslist.com',
    'Resident Referral'
];

const analyze = (guestCards) => {
    console.log(guestCards.length);

    return [];
};

module.exports.analyze = analyze;
module.exports.getMarketingSources = getMarketingSources;
module.exports.makeMarketingSourceObjects = makeMarketingSourceObjects;
module.exports.getTotalLeads = getTotalLeads;
