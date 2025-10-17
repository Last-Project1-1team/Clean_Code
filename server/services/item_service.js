// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

const { convertObjToAry, formatDate, formatFullDate } = require("../utils/converts.js");
const findAll = async (itemCode, itemName) => {
  let list = await mariadb.query("selectItemList", [`%${itemCode || ""}%`, `%${itemName || ""}%`]).catch((err) => console.log(err));
  return list;
};

const findOutOrderItem = async (itemCode, itemName) => {
  let list = await mariadb.query("itemOutordSelect", [`%${itemCode || ""}%`, `%${itemName || ""}%`]).catch((err) => console.log(err));
  return list;
};

const findOutOrderList = async (outordDate) => {
  let outordDate_form = formatFullDate(outordDate);
  console.log(outordDate_form);
  let list = await mariadb.query("outordListSelect", outordDate_form).catch((err) => console.log(err));
  return list;
};

const findOutOrderCust = async (custCode, custName) => {
  let list = await mariadb.query("custOutordSelect", [`%${custCode || ""}%`, `%${custName || ""}%`]).catch((err) => console.log(err));
  return list;
};

const findClass = async () => {
  let list = await mariadb.query("selectClass").catch((err) => console.log(err));
  return list;
};

const findUnit = async () => {
  let list = await mariadb.query("selectUnit").catch((err) => console.log(err));
  return list;
};
const addNewItem = async (itemInfo) => {
  let insertColumns = ["item_code", "item_name", "spec", "item_class", "unit", "lot_p_qty", "ea_p_qty", "safety_stock", "use_yn"];
  let data = convertObjToAry(itemInfo, insertColumns);
  let resInfo = await mariadb.query("insertItems", data).catch((err) => console.log(err));
  let result = null;
  if (resInfo.insertId == 0) {
    result = {
      isSuccessed: true,
    };
  } else {
    result = {
      isSuccessed: false,
    };
  }
  return result;
};

const addNewOutord = async (orderDate, deliveryDate, custCode, items) => {
  let conn;
  try {
    conn = await mariadb.getConnection();
    await conn.beginTransaction();

    // 오늘 날짜 YYMMDD 구하기
    const datePart = formatDate(orderDate);
    const lastList = await conn.query(sqlList.selectLastOutordNo, [`OO${datePart}%`]);
    let seq = 1;
    if (lastList.length > 0) {
      const lastNo = lastList[0].OUTORD_NO;
      const lastSeq = parseInt(lastNo.slice(-5)); // 마지막 5자리 추출
      seq = lastSeq + 1;
    }
    let outordDate = formatFullDate(orderDate);
    let outdelDate = formatFullDate(deliveryDate);

    // 신규 발주번호 생성 (OO + YYMMDD + 5자리SEQ)
    const outordNo = `OO${datePart}${String(seq).padStart(5, "0")}`;
    const createdBy = "tester";

    // 마스터 등록

    let insertMaster = [outordNo, outordDate, custCode, outdelDate, createdBy];
    await conn.query(sqlList.insertOutordMaster, insertMaster);

    // 상세 등록
    let detailNo = 1;
    // createdBy = "0000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (const item of items) {
      let insertDetail = [detailNo, outordNo, item.itemCode, item.qty, createdBy];
      await conn.query(sqlList.insertOutordDetail, insertDetail);
      detailNo++;
    }

    await conn.commit();
    return { outordNo, itemCount: items.length };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("발주 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};

const findOutOrderDetail = async (outordNo) => {
  let list = await mariadb.query("outorderDetailSelect", outordNo).catch((err) => console.log(err));
  return list;
};

const addNewInput = async (inputDate, outordNo, items) => {
  let conn;
  console.log("입고등록 시작");
  try {
    conn = await mariadb.getConnection();

    const datePart = formatDate(inputDate);
    const [last] = await conn.query(sqlList.selectLastInputNo, [`IP${datePart}%`]);
    console.log(last);
    let seq = 1;
    if (last && last.input_no) {
      const lastSeq = parseInt(last.input_no.slice(-5));
      seq = lastSeq + 1;
    }

    const payload = {
      inputDate: formatFullDate(inputDate),
      outordNo,
      createdBy: "tester",
      inputNoPrefix: `IP${datePart}`,
      startSeq: seq,
      items,
    };
    console.log("프로시저 호출 시작");
    console.log(payload);
    await conn.query(` CALL SP_INPUT_BATCH(?, @P_RETURN_CODE, @P_RETURN_MSG, @P_TOTAL_COUNT, @P_LAST_INPUT_NO)  `, [JSON.stringify(payload)]);
    console.log("프로시저 정상 작동");
    const [result] = await conn.query(`
      SELECT 
        @P_RETURN_CODE AS CODE,
        @P_RETURN_MSG AS MSG,
        @P_TOTAL_COUNT AS TOTAL_COUNT,
        @P_LAST_INPUT_NO AS LAST_INPUT_NO
    `);

    console.log("DB 결과:", result);

    return {
      success: result.CODE === "S",
      code: result.CODE,
      message: result.MSG,
      totalCount: result.TOTAL_COUNT,
      lastInputNo: result.LAST_INPUT_NO,
    };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("입고 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};
const findInputList = async (status, itemCode, itemName) => {
  let list = await mariadb.query("selectInputList", [status, `%${itemCode || ""}%`, `%${itemName || ""}%`]).catch((err) => console.log(err));
  return list;
};
const addNewInputConfirm = async (items) => {
  let conn;
  console.log("입고확정 시작");
  try {
    conn = await mariadb.getConnection();

    await conn.query(` CALL SP_INPUT_CONFIRM(?, @P_RETURN_CODE, @P_RETURN_MSG)  `, [JSON.stringify(items)]);
    console.log("프로시저 정상 작동");
    const [result] = await conn.query(`
      SELECT 
        @P_RETURN_CODE AS CODE,
        @P_RETURN_MSG AS MSG
    `);

    console.log("DB 결과:", result);

    return {
      success: result.CODE === "S",
      code: result.CODE,
      message: result.MSG,
    };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("입고 확정 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};
const findOutputStock = async () => {
  let list = await mariadb.query("selectOutputStock").catch((err) => console.log(err));
  return list;
};
const findOutputLot = async (lotNo) => {
  let list = await mariadb.query("selectOutputLot", lotNo).catch((err) => console.log(err));
  return list;
};

const addNewOutput = async (lotNo, outputStock, lotQty) => {
  let conn;
  console.log("출고등록 시작");
  try {
    conn = await mariadb.getConnection();

    const datePart = formatDate(new Date());
    console.log(datePart);
    const [last] = await conn.query(sqlList.selectLastOutputNo, [`OP${datePart}%`]);
    let seq = 1;
    if (last && last.output_no) {
      const lastSeq = parseInt(last.output_no.slice(-5));
      seq = lastSeq + 1;
    }

    const payload = {
      outputDate: formatFullDate(new Date()),
      lotNo: lotNo,
      createdBy: "tester",
      outputNoPrefix: `IP${datePart}`,
      outputStock: outputStock,
      lotQty: parseFloat(lotQty),
    };
    console.log("프로시저 호출 시작");
    console.log(payload);
    await conn.query(` CALL SP_OUTPUT(?, @P_RETURN_CODE, @P_RETURN_MSG)  `, [JSON.stringify(payload)]);
    console.log("프로시저 정상 작동");
    const [result] = await conn.query(`
      SELECT 
        @P_RETURN_CODE AS CODE,
        @P_RETURN_MSG AS MSG
    `);

    console.log("DB 결과:", result);

    return {
      success: result.CODE === "S",
      code: result.CODE,
      message: result.MSG,
    };
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("출고 등록 실패:", error);
    throw error;
  } finally {
    if (conn) conn.release?.();
  }
};
const finditemOutput = async (outputDate) => {
  let list = await mariadb.query("selectOutputList", outputDate).catch((err) => console.log(err));
  return list;
};
const findinspList = async (itemCode) => {
  let list = await mariadb.query("selectInspList", itemCode).catch((err) => console.log(err));
  return list;
};

module.exports = {
  findAll,
  findClass,
  findUnit,
  addNewItem,
  findOutOrderItem,
  findOutOrderCust,
  addNewOutord,
  findOutOrderList,
  findOutOrderDetail,
  addNewInput,
  findInputList,
  addNewInputConfirm,
  findOutputStock,
  findOutputLot,
  addNewOutput,
  finditemOutput,
  findinspList,
  // findByBookNo,
  // addNewBook,
};
