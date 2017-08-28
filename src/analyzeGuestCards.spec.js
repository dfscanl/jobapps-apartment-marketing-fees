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

    expect(quarterObjects['Q1 2013']['Rentlix.com'].length).toBe(1);
    expect(quarterObjects['Q1 2013']['Rentlix.com'][0].marketing_source).toBe('Rentlix.com');
    expect(quarterObjects['Q1 2013']['Rentlix.com'][0].first_seen).toBe('2013-02-01');
    expect(quarterObjects['Q1 2013']['Rentlix.com'][0].lease_signed).toBe('2013-03-16');

    expect(quarterObjects['Q3 2013']).toBe(undefined);

    expect(quarterObjects['Q1 2014']['Craigslist.com'].length).toBe(1);
});

it('should put a card with first_seen and lease_signed dates in different quarters', () => {
    const testGuestCards = [{
        marketing_source: 'Rentlix.com',
        first_seen: '2013-02-01',
        lease_signed: '2013-09-16'
    }];

    const quarterObjects = analyzer.createQuarterObjects(testGuestCards);

    expect(quarterObjects['Q1 2013']['Rentlix.com'].length).toBe(1);
    expect(quarterObjects['Q3 2013']['Rentlix.com'].length).toBe(1);
});

it('should calculate the best marketing source by dollar spent per lead cost within a quarter', () => {
    const testGuestCards = [{
        first_seen: '2013-01-01',
        marketing_source: 'Craigslist.com',
        lease_signed: '2013-03-01'
    }, {
        first_seen: '2013-02-07',
        marketing_source: 'Craigslist.com',
        lease_signed: '2013-05-09'
    }, {
        first_seen: '2013-02-01',
        marketing_source: 'Rent.com',
        lease_signed: '2013-03-09'
    }, {
        first_seen: '2013-01-16',
        marketing_source: 'Rent.com',
        lease_signed: '2013-03-01'
    }];

    const testAnalytics = analyzer.analyze(testGuestCards);

    expect(testAnalytics.length).toBe(2);

    // const testFinalOutputString = analyzer.compileToOutputString(testAnalytics['Q1 2013']);
    const expectedString = `Q1 2013:

1. Craigslist.com - total leads: 2, signed leases: 2, total cost: $0.00, avg cost per lead: $0.00
2. Rent.com - total leads: 2, signed leases: 2, total cost: $595.00, avg cost per lead: $297.50`;

    expect(testAnalytics[0]).toBe(expectedString);
});
