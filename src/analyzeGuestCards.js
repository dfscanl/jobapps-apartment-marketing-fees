const _ = require('lodash');

const getMarketingSources =
    guestCards => _.uniq(guestCards.map(guestCard => guestCard.marketing_source));

const analyze = (guestCards) => {
    console.log(guestCards.length);

    return [];
};

module.exports.analyze = analyze;
module.exports.getMarketingSources = getMarketingSources;
