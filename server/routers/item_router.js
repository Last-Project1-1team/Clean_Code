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

router.get("/outorder", async (req, res) => {
  const fromDate = req.query.fromDate || req.query["fromDate[date]"];
  const toDate = req.query.toDate || req.query["toDate[date]"];

  console.log("조회기간:", fromDate, "~", toDate);
  let outOrdList = await itemService.findOutOrder(fromDate, toDate).catch((err) => console.log(err));
  res.send(outOrdList);
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
  let status = req.query.status;
  let itemCode = req.query.itemCode;
  let itemName = req.query.itemName;
  let itemList = await itemService.findInputList(status, itemCode, itemName).catch((err) => console.log(err));
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

router.get("/iteminput", async (req, res) => {
  const itemCode = req.query.itemCode;
  const itemName = req.query.itemName;
  const fromDate = req.query.fromDate || req.query["fromDate[date]"];
  const toDate = req.query.toDate || req.query["toDate[date]"];
  console.log("코드 :" + itemCode + " 이름 : " + itemName + "날짜 : " + fromDate + toDate);
  let outOrdList = await itemService.findInput(itemCode, itemName, fromDate, toDate).catch((err) => console.log(err));
  res.send(outOrdList);
});

router.get("/itemOutput/outputStock", async (req, res) => {
  let stocklist = await itemService.findOutputStock().catch((err) => console.log(err));
  res.send(stocklist);
});

router.get("/outputLot", async (req, res) => {
  let lotNo = req.query.lotNo;
  console.log(lotNo);
  let itemList = await itemService.findOutputLot(lotNo).catch((err) => console.log(err));
  res.send(itemList);
});
router.post("/itemOutput", async (req, res) => {
  const { lotNo, outputStock, lotQty } = req.body;
  try {
    const result = await itemService.addNewOutput(lotNo, outputStock.code, lotQty);
    res.status(200).json({
      message: "출고정보 저장 성공",
    });
  } catch (error) {
    console.error("출고 저장 실패:", error);
    res.status(500).json({
      message: "출고정보 저장 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

router.get("/itemOutput", async (req, res) => {
  let outputDatefr = req.query.outputDatefr;
  let outputDateto = req.query.outputDateto;
  let itemCode = req.query.itemCode;
  let itemName = req.query.itemName;
  let outputList = await itemService.finditemOutput(itemCode, itemName, outputDatefr, outputDateto).catch((err) => console.log(err));
  res.send(outputList);
});

router.get("/inspList", async (req, res) => {
  let itemCode = req.query.itemCode;
  let outputList = await itemService.findinspList(itemCode).catch((err) => console.log(err));
  res.send(outputList);
});

router.post("/inspResult", async (req, res) => {
  const { inputNo, result, items } = req.body;
  try {
    const inspResult = await itemService.addNewInsp(inputNo, result, items);
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

router.get("/itemStock", async (req, res) => {
  const itemCode = req.query.itemCode;
  const itemName = req.query.itemName;
  let itemStock = await itemService.finditemStockList(itemCode, itemName).catch((err) => console.log(err));
  res.send(itemStock);
});

router.get("/itemLot", async (req, res) => {
  const itemCode = req.query.itemCode;
  const itemName = req.query.itemName;
  let itemLot = await itemService.finditemLotList(itemCode, itemName).catch((err) => console.log(err));
  res.send(itemLot);
});

router.get("/prodLotList", async (req, res) => {
  let status = req.query.status;
  let modelCode = req.query.modelCode;
  let modelRevision = req.query.modelRevision;
  let modelName = req.query.modelName;
  let itemList = await itemService.findprodLotList(status, modelCode, modelRevision, modelName).catch((err) => console.log(err));
  res.send(itemList);
});
router.get("/modelinspList", async (req, res) => {
  let modelCode = req.query.modelCode;
  let modelInspList = await itemService.findmodelinspList(modelCode).catch((err) => console.log(err));
  res.send(modelInspList);
});

router.post("/modelInspResult", async (req, res) => {
  const { prodLot, result, items } = req.body;
  try {
    const inspResult = await itemService.addNewModelInsp(prodLot, result, items);
    res.status(200).json({
      message: "완제품검사 결과 저장 성공",
    });
  } catch (error) {
    console.error("가입고 저장 실패:", error);
    res.status(500).json({
      message: "완제품검사 결과 저장 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

module.exports = router;
