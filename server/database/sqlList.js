// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
const models = require("./sqls/models.js");
const workOrd = require("./sqls/workOrder.js");
const items = require("./sqls/items.js");
const inords = require("./sqls/inord.js");
const resultWork = require("./sqls/resultWork.js");
const account = require("./sqls/account.js");
const common = require("./sqls/common.js");
const ship = require("./sqls/ship.js");

module.exports = {
  ...models,
  ...items,
  ...inords,
  ...account,
  ...workOrd,
  ...common,
  ...resultWork,
  ...ship,
};
