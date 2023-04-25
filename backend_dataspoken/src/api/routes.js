import os from 'os';
import { Router } from 'express';
import multer from 'multer';

import { getRawData, createRawData, approveAccess, getFileStream } from './raw-data';
import { getPapers, createPaper } from './papers';

// const upload = multer({ dest: `${__dirname}/../../datafiles` });
const upload = multer({ dest: os.tmpdir() });

export const routes = Router();

routes.get('/data', async (req, res) => {
    try {
        const caller = req.query.wallet_address;
        const rawData = await getRawData(caller);
        res.status(200).send(rawData);
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

routes.post('/data', upload.single('file'), async (req, res) => {
    try {
        const caller = req.body.wallet_address;
        const metadata = JSON.parse(req.body.metadata);
        const rawData = await createRawData(caller, req.file, metadata);
        res.status(201).send(rawData);
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

routes.post('/data/:dataId/approve/:to', async (req, res) => {
    try {
        const caller = req.body.wallet_address;
        await approveAccess(caller, req.params.dataId, req.params.to);
        res.status(201).send();
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

routes.get('/data/:dataId/file', async (req, res) => {
    try {
        const fileStream = await getFileStream(req.query.wallet_address, req.params.dataId);
        if (!fileStream) {
            res.sendStatus(400);
            return;
        }
        fileStream.pipe(res);
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

routes.get('/papers', async (req, res) => {
    try {
        const caller = req.query.wallet_address;
        const papers = await getPapers(caller);
        res.status(200).send(papers);
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

routes.post('/papers', async (req, res) => {
    try {
        const { wallet_address: caller, title, organization, figures: figuresString } = req.body;
        const figures = JSON.parse(figuresString);
        const payload = {
            author: caller,
            title,
            organization,
            figures
        };
        const paper = await createPaper(caller, payload);
        res.status(201).send(paper);
    } catch (err) {
        res.status(500).send({ error: getErrorString(err) });
    }
});

function getErrorString(err) {
    return `${err.response && JSON.stringify(err.response.body) && err.response.text}\n${err.stack}`;
}