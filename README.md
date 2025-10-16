# Clean_Code

211.188.49.138

const apiUrl = import.meta.env.VITE_API_BASE_URL;

fetch(`${apiUrl}/users`)
.then(res => res.json())
.then(data => console.log(data));

// 이렇게 사용

SELECT DISTINCT LVL, LOW_CODE, LOW_REVISION, NEED_QTY, PATH
FROM V_BOM_LIST
WHERE MODEL_CODE = 'B00002'
ORDER BY PATH;

SELECT \* FROM V_BOM_LIST A
LEFT OUTER JOIN V_ITEM_MASTER B
ON A.LOW_CODE = B.ITEM_CODE
WHERE MODEL_CODE = 'M00001'
ORDER BY PATH;

some()
배열의 요소 중 하나라도 주어진 조건을 만족하면 true, 모두 만족하지 않으면 false를 반환한다.

예시 1: // 짝수가 하나라도 있으면 true
const numbers = [1, 3, 4, 7, 9];

const evenumber = numbers.some(num => num % 2 === 0);

console.log(evenumber ); // true

예시 2: // 짝수가 하나도 없으면 false
const numbers = [1, 3, 5, 7, 9];

const oddnumber = numbers.some(num => num % 2 === 0);

console.log(oddnumber); // false

filter(), some() 함수 같이쓰기

// 첫 번째 배열: lotNolist
const lotNolist = [
{ MODEL_CODE: 'A100', REVISION: 'R1' },
{ MODEL_CODE: 'A200', REVISION: 'R1' },
{ MODEL_CODE: 'A300', REVISION: 'R2' }
];

// 두 번째 배열: inordlisttest
const inordlisttest = [
{ MODEL_CODE: 'A100', REVISION: 'R1' },
{ MODEL_CODE: 'A400', REVISION: 'R3' }
];

// 새로운 배열: filter + some 조합.
const shiplist = lotNolist.filter(lot =>
inordlisttest.some(inord =>
lot.MODEL_CODE === inord.MODEL_CODE && lot.REVISION === inord.REVISION
)
);

console.log(shiplist); // 결과: { MODEL_CODE: 'A100', REVISION: 'R1', LOT: 'L01' }
