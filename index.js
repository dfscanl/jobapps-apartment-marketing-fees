const analyzer = require('./src/analyzeGuestCards');
const guestCards = require('./guest_cards.json');

const analytics = analyzer.analyze(guestCards);

const finalResult = analytics.reduce((total, current) => `${ current }\n\n`, '');

console.log(finalResult);
