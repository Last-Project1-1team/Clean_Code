// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
const models = require("./sqls/models.js");

const items = require("./sqls/items.js");

const account = require("./sqls/account.js");

module.exports = {
  ...models,
  ...items,
  ...account,
};
