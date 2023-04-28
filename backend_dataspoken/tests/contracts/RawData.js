const RawData = artifacts.require('RawData');

contract('RawData', (accounts) => {
    let rawDataInstance;
    let experimenter = accounts[1];
    let author = accounts[2];

    before(async () => {
        rawDataInstance = await RawData.deployed();
    });

    it('should create a raw data entry', async () => {
        await rawDataInstance.create('dsid', 'commaSeparated', 'HASHED_DATA', 'Comma Separated Numbers', { from: experimenter });
        const ids = await rawDataInstance.getRawDataIds({ from: experimenter });
        assert.equal(ids.length, 1);
        assert.equal(ids[0].toNumber(), 0);
    });

    it('should be able to grant access to author', async () => {
        await rawDataInstance.approveAccess(0, author, { from: experimenter });
        const ids = await rawDataInstance.getRawDataIds({ from: author });
        assert.equal(ids.length, 1);
        assert.equal(ids[0].toNumber(), 0);
        const { 2: dataType, 3: description } = await rawDataInstance.getMetadata(0, { from: author });
        assert.equal(dataType, 'commaSeparated');
        assert.equal(description, 'Comma Separated Numbers');
    });

    it('should publish a data', async () => {
        await rawDataInstance.publish(0, { from: author });
    });
});
