// Service에서 필요하면 DB에 접속할 수 있도록 mapper를 가져옴
const mariadb = require("../database/mapper.js");
const sqlList = require("../database/sqlList.js");

// 수주, lot 단건조회
const findCustCodeNo = async (custno) => {
  let inordlist = await mariadb
    .query("shipmodel", [custno])
    .catch((err) => console.log(err));
  console.log(inordlist);
  return inordlist;
};

const findLotNo = async (lotno) => {
  let lotlist = await mariadb
    .query("lotnoscan", [lotno])
    .catch((err) => console.log(err));
  console.log(lotlist);
  return lotlist;
};

//제품단건조회
// const findmodel = async (modelno) => {
//   let modellist = await mariadb
//     .query("modelinfo", [modelno])
//     .catch((err) => console.log(err));
//   console.log(modellist);
//   return modellist;
// };

//제품단건조회 (지피티)
const findmodel = async (modelno) => {
  const inClause = modelno.map((no) => `'${no}'`).join(",");
  const modelsql = sqlList.modelinfoIn.replace("IN (?)", `IN (${inClause})`); //const query = mariadb.query('modelinfoIn', inClause); //이렇게 하면 ('B00001','B00002') => (''B00001','B00002'') 이렇게 되버림

  const modellist = await mariadb
    .query(modelsql, modelno)
    .catch((err) => console.log(err));
  return modellist;
};

//출하등록

module.exports = {
  findCustCodeNo,
  findLotNo,
  findmodel,
};
