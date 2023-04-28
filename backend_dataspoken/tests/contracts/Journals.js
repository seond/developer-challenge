const RawData = artifacts.require('RawData');
const Papers = artifacts.require('Papers');
const Journals = artifacts.require('Journals');

contract('Journals', (accounts) => {
    let rawDataInstance;
    let papersInstance;
    let journalsInstance;
    let experimenter = accounts[1];
    let author = accounts[2];
    let conference = accounts[3];
    let reviewer = accounts[4];

    before(async () => {
        rawDataInstance = await RawData.deployed();
        papersInstance = await Papers.deployed(rawDataInstance);
        journalsInstance = await Journals.deployed(papersInstance, conference);

        await rawDataInstance.create('dsid', 'commaSeparated', 'HASHED_DATA_1', 'Comma Separated Numbers', { from: experimenter });
        await rawDataInstance.create('dsid', 'image', 'HASHED_DATA_2', 'MRI Scan Results', { from: experimenter });
        await rawDataInstance.create('dsid', 'commaSeparated', 'HASHED_DATA_3', 'Signals', { from: experimenter });
        const ids = await rawDataInstance.getRawDataIds({ from: experimenter });
        const rawDataIds = [];
        for (let i = 0; i < ids.length; i++) {
            await rawDataInstance.approveAccess(ids[i], author, { from: experimenter });
            rawDataIds.push(ids[i]);
        }
        await papersInstance.create('dsid', rawDataIds, 'My Great Paper', 'My Great Organization', { from: author });
        await papersInstance.create('dsid', rawDataIds, 'My Great Paper2', 'My Great Organization', { from: author });
        await papersInstance.create('dsid', rawDataIds, 'My Great Paper3', 'My Great Organization', { from: author });
    });

    it('should create journal, publish a paper and retract a paper', async () => {
        await journalsInstance.create('Journal of Papers', 'About Nothing', '14378242', { from: conference });
        await journalsInstance.create('Journal of Papers', 'About Nothing', '14378242', { from: conference });
        assert.equal((await journalsInstance.getLatestJournalId.call()).toNumber(), 1);
        await journalsInstance.publishToJournal(0, 0, { from: author });
        await journalsInstance.publishToJournal(0, 1, { from: author });
        await journalsInstance.publishToJournal(0, 2, { from: author });
        let reviewerInfo;
        await journalsInstance.review(0, { from: reviewer });
        reviewerInfo = await journalsInstance.getReviewerInfo.call(reviewer);
        assert.equal(reviewerInfo.score.toNumber(), 1);
        await journalsInstance.review(1, { from: reviewer });
        reviewerInfo = await journalsInstance.getReviewerInfo.call(reviewer);
        assert.equal(reviewerInfo.score.toNumber(), 2);
        await journalsInstance.retract(0, 0, { from: conference });
        reviewerInfo = await journalsInstance.getReviewerInfo.call(reviewer);
        assert.equal(reviewerInfo.score.toNumber(), -8);
        await journalsInstance.review(1, { from: reviewer });
        const reviewers = await journalsInstance.getReviewers.call();
        assert.equal(reviewers.length, 1);
        assert.equal(reviewers[0], reviewer);
    });
});
