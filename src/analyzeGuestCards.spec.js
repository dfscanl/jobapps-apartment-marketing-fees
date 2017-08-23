const analyzer = require('./analyzeGuestCards');

it('should take an array of cards and return a list of unique marketing sources', () => {
    const testGuestCards = [{
        marketing_source: 'Rentlix.com'
    }, {
        marketing_source: 'Craigslist.com'
    }];

    const marketingSources = analyzer.getMarketingSources(testGuestCards);

    expect(marketingSources.length).toBe(2);
    expect(marketingSources[0]).toBe('Rentlix.com');
    expect(marketingSources[1]).toBe('Craigslist.com');
});

it('should take array of marketing sources and return objects', () => {
    const marketingSourcesNames = ['Rentlix.com', 'Craigslist.com'];

    const marketingSourceObjects = analyzer.makeMarketingSourceObjects(marketingSourcesNames);

    expect(marketingSourceObjects.length).toBe(2);
    expect(marketingSourceObjects[0].name).toBe('Rentlix.com');
    expect(marketingSourceObjects[1].name).toBe('Craigslist.com');
});

it('should find the total number of leads for every marketing source in a guest card array', () => {
    const testGuestCards = [{
        marketing_source: 'Rentlix.com'
    }, {
        marketing_source: 'Craigslist.com'
    }, {
        marketing_source: 'Rentlix.com'
    }, {
        marketing_source: 'Craigslist.com'
    }, {
        marketing_source: 'Craigslist.com'
    }];

    const marketingSourcesNames = analyzer.getMarketingSources(testGuestCards);
    let marketingSourceObjects = analyzer.makeMarketingSourceObjects(marketingSourcesNames);
    marketingSourceObjects = analyzer.getTotalLeases(marketingSourceObjects, testGuestCards);

    expect(marketingSourceObjects['Rentlix.com'].totalLeads).toBe(2);
    expect(marketingSourceObjects['Craigslist.com'].totalLeads).toBe(3);
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
