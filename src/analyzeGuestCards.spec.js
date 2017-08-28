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
    const marketingSourceObjects = analyzer.makeMarketingSourceObjects(marketingSourcesNames);
    analyzer.getTotalLeads(marketingSourceObjects, testGuestCards);

    expect(marketingSourceObjects[0].totalLeads).toBe(2);
    expect(marketingSourceObjects[1].totalLeads).toBe(3);
});

it('should get the number of signed leases for every marketing source', () => {
    const testGuestCards = [{
        marketing_source: 'Rentlix.com',
        first_seen: '2014-04-01',
        lease_signed: '2014-08-16'
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2014-04-01',
        lease_signed: '2014-05-06'
    }, {
        marketing_source: 'Rentlix.com',
        first_seen: '2014-04-01',
        lease_signed: null
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2014-04-01',
        lease_signed: null
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2014-04-01',
        lease_signed: '2014-04-16'
    }];

    const marketingSourcesNames = analyzer.getMarketingSources(testGuestCards);
    const marketingSourceObjects = analyzer.makeMarketingSourceObjects(marketingSourcesNames);
    analyzer.getSignedLeases(marketingSourceObjects, testGuestCards);

    expect(marketingSourceObjects[0].signedLeases).toBe(1);
    expect(marketingSourceObjects[1].signedLeases).toBe(2);
});

it('should build a new object where cards are sorted by quarters', () => {
    const testGuestCards = [{
        marketing_source: 'Rentlix.com',
        first_seen: '2013-02-01',
        lease_signed: '2013-03-16'
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2013-04-01',
        lease_signed: '2013-06-06'
    }, {
        marketing_source: 'Rentlix.com',
        first_seen: '2014-04-01',
        lease_signed: null
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2014-01-01',
        lease_signed: null
    }, {
        marketing_source: 'Craigslist.com',
        first_seen: '2014-08-01',
        lease_signed: '2014-09-16'
    }];

    const quarterObjects = analyzer.createQuarterObjects(testGuestCards);
    const marketingSourcesNames = analyzer.getMarketingSources(testGuestCards);
    analyzer.addMarketingSourcesToQuarterObjects(quarterObjects, marketingSourcesNames);

    expect(quarterObjects['Q1 2013'].length).toBe(1);
    expect(quarterObjects['Q1 2013']).toBe({ 'Rentlix.com': [{ first_seen: '2013-02-01', lease_signed: '2013-03-16' }] });
    expect(quarterObjects['Q3 2013']).toBe(undefined);
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
