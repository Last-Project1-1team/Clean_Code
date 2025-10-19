// mapper.js 불러오기
const mariadb = require("../database/mapper.js");

//객체 -> 배열 변환 (유틸함수)
const { convertObjToAry } = require("../utils/converts.js");

// LOT 스캔 시 정보 조회
const findLotInfo = async (lotNo) => {
    
    try {
        const params = convertObjToAry({ lotNo });

        const result = await mariadb.query(sql.selectLotInfo, params);

        if (result.length === 0) {
            return { status: 'NOT_FOUND', message: '해당 LOT번호가 존재하지 않습니다.' };
        }

        const lot = result[0];

        // 출고 상태 및 공정 일치 여부 체크
        if (lot.shipStatus !== 'Y') {
            return {
                status: 'INVALID',
                message: '출고 상태가 아닙니다! 잘못된 공정입니다!',
                data: lot
            };
        }

        return {
            status: 'OK',
            message: '정상적인 LOT입니다.',
            data: lot
        };
    } catch (err) {
        console.error('LOT 조회 중 오류:', err);
        throw err;
    }
};

module.exports = {
    findLotInfo,
};