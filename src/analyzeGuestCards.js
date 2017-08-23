const _ = require('lodash');

const getMarketingSources =
    guestCards => _.uniq(guestCards.map(guestCard => guestCard.marketing_source));

const makeMarketingSourceObjects =
    marketingSources => marketingSources.map((source) => {
        const newSourceObject = { name: source };

        return newSourceObject;
    });

const analyze = (guestCards) => {
    console.log(guestCards.length);

    return [];
};

module.exports.analyze = analyze;
module.exports.getMarketingSources = getMarketingSources;
module.exports.makeMarketingSourceObjects = makeMarketingSourceObjects;
