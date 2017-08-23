const analyzer = require('./src/analyzeGuestCards');
const guestCards = require('./guest_cards.json');

const marketingSources = analyzer.getMarketingSources(guestCards);

console.log(marketingSources);
