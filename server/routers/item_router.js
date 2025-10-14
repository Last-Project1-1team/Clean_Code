const express = require("express");
const router = express.Router();
const itemService = require("../services/item_service.js");
router.get("/itemMaster", async (req, res) => {
    let itemCode = req.query.itemCode;
    let itemName = req.query.itemName;
    let itemList = await itemService.findAll(itemCode, itemName).catch((err) => console.log(err));
    res.send(itemList);
});
router.get("/itemMaster/itemClass", async (req, res) => {
    let classList = await itemService.findClass().catch((err) => console.log(err));
    res.send(classList);
});

router.get("/itemMaster/unit", async (req, res) => {
    let unitList = await itemService.findUnit().catch((err) => console.log(err));
    res.send(unitList);
});
router.post("/itemMaster", async (req, res) => {
    let itemInfo = req.body;
    let result = await itemService.addNewItem(itemInfo).catch((err) => console.log(err));
    res.send(result);
});
router.get("/outorderitem", async (req, res) => {
    let itemCode = req.query.itemCode;
    let itemName = req.query.itemName;
    let itemList = await itemService.findOutOrderItem(itemCode, itemName).catch((err) => console.log(err));
    res.send(itemList);
});

router.get("/outordercust", async (req, res) => {
    let custCode = req.query.custCode;
    let custName = req.query.custName;
    let custList = await itemService.findOutOrderCust(custCode, custName).catch((err) => console.log(err));
    res.send(custList);
});

router.post("/outord", async (req, res) => {
    const { orderDate, deliveryDate, custCode, custName, items } = req.body;

    try {
        const result = await itemService.addNewOutord(orderDate, deliveryDate, custCode, items);
        res.status(200).json({
            message: "발주정보 저장 성공",
            outordNo: result.outordNo,
            itemCount: result.itemCount,
        });
    } catch (error) {
        console.error("❌ 발주 저장 실패:", error);
        res.status(500).json({
            message: "발주정보 저장 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

router.get("/outorderList", async (req, res) => {
    let outordDate = req.query["outordDate[date]"];
    let custList = await itemService.findOutOrderList(outordDate).catch((err) => console.log(err));
    res.send(custList);
});

router.get("/outorderDetail", async (req, res) => {
    let outordNo = req.query.outordNo;
    console.log(outordNo);
    let custList = await itemService.findOutOrderDetail(outordNo).catch((err) => console.log(err));
    res.send(custList);
});

router.post("/input", async (req, res) => {
    const { inputDate, outordNo, items } = req.body;
    try {
        const result = await itemService.addNewInput(inputDate, outordNo, items);
        res.status(200).json({
            message: "가입고정보 저장 성공",
        });
    } catch (error) {
        console.error("가입고 저장 실패:", error);
        res.status(500).json({
            message: "가입고정보 저장 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});
router.get("/inputList", async (req, res) => {
    let itemCode = req.query.itemCode;
    let itemName = req.query.itemName;
    let itemList = await itemService.findInputList(itemCode, itemName).catch((err) => console.log(err));
    res.send(itemList);
});
router.post("/inputList", async (req, res) => {
    const inputList = req.body;
    try {
        const result = await itemService.addNewInputConfirm(inputList);
        res.status(200).json({
            message: "입고정보 확정 성공",
        });
    } catch (error) {
        console.error("입고 확정 실패:", error);
        res.status(500).json({
            message: "입고정보 확정 중 오류가 발생했습니다.",
            error: error.message,
        });
    }
});

module.exports = router;
