const express = require('express');
const router = express.Router();
const receivingService = require('../services/receiving_service');

// LOT 스캔 요청
router.get('/receiving', async (req, res) => {
    try {
        const lotNo = req.params.lotNo;
        const result = await receivingService.findLotInfo(lotNo);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;