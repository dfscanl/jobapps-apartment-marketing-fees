const analyzer = require('./analyzeGuestCards');

it('should take an array of cards and return a list of unique marketing sources', () => {
    const testGuestCards = [{
        id: 1819908,
        first_seen: '2014-04-04',
        expected_move_in: null,
        shown_unit: null,
        agent_id: 3519,
        marketing_source: 'Rentlix.com',
        application_submitted: null,
        application_approved: null,
        application_denied: null,
        application_canceled: null,
        lease_signed: null,
        resident_rent: null,
        unit_name: null
    }, {
        id: 1819911,
        first_seen: '2014-04-07',
        expected_move_in: '2014-05-01',
        shown_unit: null,
        agent_id: 3519,
        marketing_source: 'Craigslist.com',
        application_submitted: null,
        application_approved: null,
        application_denied: null,
        application_canceled: null,
        lease_signed: null,
        resident_rent: null,
        unit_name: null
    }];

    const marketingSources = analyzer.getMarketingSources(testGuestCards);

    expect(marketingSources.length).toBe(2);
    expect(marketingSources[0]).toBe('Rentlix.com');
    expect(marketingSources[1]).toBe('Craigslist.com');
});

it.skip('should take an array of cards and return another array of analyzes objects', () => {
    const testGuestCards = [{
        id: 1819911,
        first_seen: '2014-04-07',
        expected_move_in: '2014-05-01',
        shown_unit: null,
        agent_id: 3519,
        marketing_source: 'Craigslist.com',
        application_submitted: null,
        application_approved: null,
        application_denied: null,
        application_canceled: null,
        lease_signed: null,
        resident_rent: null,
        unit_name: null
    }];

    const testAnalytics = analyzer.analyze(testGuestCards);

    expect(testAnalytics.length).toBe(0);
});
