// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

const { convertObjToAry, formatDate, formatFullDate } = require("../utils/converts.js");
// 실제 제공할 서비스 등록 영역
// 조건 없이 전체조회
const findAll = async (itemCode, itemName) => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariadb
        .query("selectItemList", [`%${itemCode || ""}%`, `%${itemName || ""}%`])
        .catch((err) => console.log(err));
    return list;
};

const findOutOrderItem = async (itemCode, itemName) => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariadb
        .query("itemOutordSelect", [`%${itemCode || ""}%`, `%${itemName || ""}%`])
        .catch((err) => console.log(err));
    return list;
};

const findOutOrderList = async (outordDate) => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let outordDate_form = formatFullDate(outordDate);
    console.log(outordDate_form);
    let list = await mariadb.query("outordListSelect", outordDate_form).catch((err) => console.log(err));
    return list;
};

const findOutOrderCust = async (custCode, custName) => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariadb
        .query("custOutordSelect", [`%${custCode || ""}%`, `%${custName || ""}%`])
        .catch((err) => console.log(err));
    return list;
};

const findClass = async () => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariadb.query("selectClass").catch((err) => console.log(err));
    return list;
};

const findUnit = async () => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariadb.query("selectUnit").catch((err) => console.log(err));
    return list;
};
// // 북번호를 기준으로 단건조회
// const findByBookNo = async (bookNo) => {
//     // bookNo : 사용자가 전달한 북번호, Number 타입
//     let list = await mariadb.query("selectBookOne", bookNo).catch((err) => console.log(err));
//     // mariadb 모듈의 경우 SELECT문의 결과는 갯수와 상관없이 배열로 반환
//     // -> 서비스의 결과로 값이 하나일 경우 변환이 필요함.
//     let info = list[0];
//     return info;
// };

// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
const addNewItem = async (itemInfo) => {
    // bookInfo : 사용자가 전달한 북정보, Object 타입

    // t_book_01 테이블에 등록하는 insert문에 정의된 컬럼들
    let insertColumns = [
        "item_code",
        "item_name",
        "spec",
        "item_class",
        "unit",
        "lot_p_qty",
        "ea_p_qty",
        "safety_stock",
        "use_yn",
    ];
    // 사용자가 전달한 북정보 중 insert문에 정의된 컬럼들 기준으로 값을 선별 : 객체 -> 배열
    let data = convertObjToAry(itemInfo, insertColumns);
    let resInfo = await mariadb.query("insertItems", data).catch((err) => console.log(err));
    // mariadb 모듈은 DML(insert, update, delete)의 결과를 { affectedRows: 1, insertId: 1, warningStatus: 0 } 로 반환
    // affectedRows : 실제 실행된 행수 (default : 0)
    // insertId     : AUTO_INCREMENT를 사용하는 경우 자동 부여된 PRIMARY KEY를 가짐, 무조건 Number 타입 (default : 0)
    let result = null;
    if (resInfo.insertId == 0) {
        // 정상적으로 등록된 경우
        result = {
            isSuccessed: true,
            // itemCode: resInfo.insertId,
        };
    } else {
        // 등록되지 않은 경우
        result = {
            isSuccessed: false,
        };
    }
    return result;
};

// 북정보(name, writer, publisher, publication_date, info)를 기반으로 등록
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

module.exports = {
    findAll,
    findClass,
    findUnit,
    addNewItem,
    findOutOrderItem,
    findOutOrderCust,
    addNewOutord,
    findOutOrderList,
    // findByBookNo,
    // addNewBook,
};
