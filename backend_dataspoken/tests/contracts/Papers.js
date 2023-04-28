const RawData = artifacts.require('RawData');
const Papers = artifacts.require('Papers');

contract('Papers', (accounts) => {
    let rawDataInstance;
    let papersInstance;
    let experimenter = accounts[1];
    let author = accounts[2];
    let rawDataIds = [];

    before(async () => {
        rawDataInstance = await RawData.deployed();
        papersInstance = await Papers.deployed(rawDataInstance);

        await rawDataInstance.create('dsid', 'commaSeparated', 'HASHED_DATA_1', 'Comma Separated Numbers', { from: experimenter });
        await rawDataInstance.create('dsid', 'image', 'HASHED_DATA_2', 'MRI Scan Results', { from: experimenter });
        await rawDataInstance.create('dsid', 'commaSeparated', 'HASHED_DATA_3', 'Signals', { from: experimenter });
        const ids = await rawDataInstance.getRawDataIds({ from: experimenter });
        for (let i = 0; i < ids.length; i++) {
            await rawDataInstance.approveAccess(ids[i], author, { from: experimenter });
            rawDataIds.push(ids[i]);
        }
    });

    it('should create a paper and publish', async () => {
        const result = await papersInstance.create('dsid', rawDataIds, 'My Great Paper', 'My Great Organization', { from: author });
        assert.equal(result.logs.length, 1);
        assert.equal(result.logs[0].event, 'paperCreated');
        const id = result.logs[0].args[0];
        await papersInstance.publish(id, { from: author });
    });
});
