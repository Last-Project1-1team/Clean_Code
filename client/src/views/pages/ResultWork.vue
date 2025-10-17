<script setup>
import { ref, computed, watch } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';
import LotModal from '@/components/LotModal.vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
// 버튼 시간 형식
const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

// start, end 타임 날짜 형식 DATETIME과 같이 맞춤
function formatDateForMySQL(date) {
    const d = new Date(date);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

const modelInfo = computed(() => {
    const d = selectedWorkOrder.value;
    return d && d.modelCode ? `${d.modelCode} / ${d.revision} / ${d.modelName}` : '';
});

// --------------------------------------- 작업지시 관련 부분 ----------------------------------------
// 작업지시 모달 오픈 전 false 상태
const openWorkOrdModal = ref(false);
// 입력한 작업지시번호
const searchWorkOrdNo = ref('');
// 선택된 작업지시 정보
const selectedWorkOrder = ref({});
// DataTable에 보여질 데이터
const workOrd = ref([]);
// rowSelect 시 표시할 데이터
const formData = ref({});

// 작업지시번호 모달창 OPEN
const openModalWithSearch = () => {
    // console.log('부모 검색 버튼 클릭:', searchWorkOrdNo.value);
    openWorkOrdModal.value = true;
};

// 모달 닫힐 때 입력값 초기화
watch(openWorkOrdModal, (newVal) => {
    if (!newVal) {
        searchWorkOrdNo.value = '';
    }
});

// 모달에서 선택된 작업지시 받아오기
const onSelectWorkOrd = async (data) => {
    selectedWorkOrder.value = data; // 모달에서 선택된 데이터 저장
    workOrd.value = [data]; // 선택된 데이터 표시
    openWorkOrdModal.value = false; // 모달 닫기
    console.log('selectedWorkOrder: ', selectedWorkOrder);

    // overQtyMap.value = 0;

    // 선택된 modelCode, revision 이용해 BOM 조회 실행
    if (data.modelCode && data.revision) {
        await fetchBomList(data.modelCode, data.revision);
    }
};

// --------------------------------------- Bom 부분 ---------------------------------------
// 여러 작업지시 데이터 저장 그리드 연결
const bomList = ref([]);

// BOM(Lot) 데이터 조회
const fetchBomList = async (modelCode, revision) => {
    try {
        // console.log('BOM 조회 요청:', modelCode, revision);
        const res = await axios.get(`${apiUrl}/resultwork/bomlist`, {
            params: { modelCode, revision }
        });
        // console.log('BOM 조회 결과:', res.data);
        bomList.value = res.data;
        console.log('bomList : ', bomList.value);
    } catch (err) {
        // console.error('❌ BOM 조회 실패:', err);
        bomList.value = [];
    }
};

// --------------------------------------- lot---------------------------------------
// lot모달 오픈 전 false 상태
const openLotModal = ref(false);
// 입력한 LOT번호
const searchLotNo = ref('');
// 선택된 행 데이터 담고있음
const selectedLot = ref({});
// DataTable에 보여질 데이터
const lot = ref([]);
// 선택된 lot번호 누적
const selectedLotNos = ref([]);
// 준비수량 확인 후 초과된 수량 저장
const overQtyMap = ref({});
// 초과된 itemCode를 저장
const blockedItems = ref(new Set());

// LOT번호 모달창 OPEN
const openModalWithLot = () => {
    // 모달창 open 시 lot 선택 초기화
    selectedLot.value = null;
    console.log('부모 검색 버튼 클릭:', searchLotNo.value);
    openLotModal.value = true;
};

// 그리드에 쓸 lotQty 값 저장용
const selectedLotQtyMap = ref({});

// 모달에서 선택된 Lot정보 받아오기
const onSelectLot = (data) => {
    console.log('data: ', data);

    // lot조회 선택시 bomList와 검증

    // 1단계: 이미 선택된 lot인지 확인  --------------------------------------- includes 는 배열이나 문자열에 특정한 값을 포함 여부를 확인하는 함수
    if (selectedLotNos.value.includes(data.lotNo)) {
        toast.add({
            severity: 'warn',
            summary: '중복 선택',
            detail: '이미 선택된 LOT입니다.',
            life: 2000
        });
        openLotModal.value = false;
        return;
    }

    // Bom에는 반제품이 들어가서 modelCode가 있지만 lot에는 자재만 있어서 modelCode 검증 필요가 없음

    // 2단계: itemCode 일치    조건 추가하려면 && 넣고 추가하면됨
    // targetBom에서 itemCode가 일치하면 true로 나와서 if(true)로 작동   == some의 결과는 true or false
    const targetBom = bomList.value.find((item) => item.itemCode === data.itemCode);
    if (!targetBom) {
        alert('일치하는 BOM 항목이 없습니다.');
        openLotModal.value = false;
        return;
    }

    // 리턴받은 lotQty값
    const resultQty = Number(data.lotQty) || 0; // undefined 방지
    const currentLotQty = Number(targetBom.lotQty) || 0; // 이미 누적된 lotQty
    const needQty = Number(targetBom.needQty) || 0; // 필요한 수량
    const newTotal = currentLotQty + resultQty;

    // ----------------------------- 3️⃣ 이미 초과로 차단된 품목인지 확인
    if (blockedItems.value.has(data.itemCode)) {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: `${data.itemCode}는 이미 필요수량을 초과하여 선택할 수 없습니다.`,
            life: 2500
        });
        openLotModal.value = false;
        return;
    }

    // needQty 초과 시 차단
    if (newTotal > needQty) {
        const over = newTotal - needQty;
        alert(`⚠️ ${targetBom.itemCode}의 Lot 수량이 필요수량(${needQty})을 초과했습니다. 초과량: ${over}`);
        // 초과량 저장
        overQtyMap.value[targetBom.itemCode] = over;

        // 초과된 상태 반영 (선택은 허용)
        targetBom.lotQty = newTotal;
        // 초과된 itemCode를 차단리스트에 추가
        blockedItems.value.add(data.itemCode);
        // ✅ lot 선택 해제 (다시 선택 불가)
        selectedLot.value = null;

        openLotModal.value = false;
        return;
    }

    // 중복 아니고 초과도 아니면 lot 선택 반영
    // 선택된 lot번호 저장
    selectedLotNos.value.push(data.lotNo);

    // 누적 로직
    if (!selectedLotQtyMap.value[data.itemCode]) {
        selectedLotQtyMap.value[data.itemCode] = 0;
    }
    selectedLotQtyMap.value[data.itemCode] += Number(resultQty);
    // targetBom.lotQty도 함께 갱신
    targetBom.lotQty = selectedLotQtyMap.value[data.itemCode];

    selectedLot.value = data;
    lot.value = [data];
    openLotModal.value = false;
};

// 모달 닫힐 때 입력값 초기화
watch(openLotModal, (newVal) => {
    if (!newVal) {
        searchLotNo.value = '';
    }
});

// --------------------------------------- 버튼 ---------------------------------------
const isStarted = ref(false);
const startTime = ref(null);
const endTime = ref(null);

// ✅ 버튼 활성화 조건: 모든 품목이 needQty 이상 준비되면 true
const isReady = computed(() => {
    return (
        bomList.value.length > 0 &&
        bomList.value.every((item) => {
            const itemCode = item.itemCode;
            const needQty = Number(item.needQty) || 0;
            const lotQty = selectedLotQtyMap.value[itemCode] || 0;
            return lotQty >= needQty;
        })
    );
});

// computed 속성으로 버튼의 severity와 label을 동적
const buttonSeverity = computed(() => (isStarted.value ? 'warn' : 'success'));
const buttonLabel = computed(() => (isStarted.value ? '일시정지' : '작업시작'));

// 시작버튼 클릭 이벤트
const startButtonClick = async () => {
    // 버튼 활성화
    if (!isReady.value) {
        alert('⚠️ 모든 품목의 준비수량이 필요수량에 도달해야 시작할 수 있습니다.');
        return;
    }
    if (!selectedWorkOrder.value || !selectedWorkOrder.value.workOrdNo) {
        alert('❌ 작업지시가 선택되지 않았습니다.');
        return;
    }
    console.log('selectedWorkOrder.value:', selectedWorkOrder.value);

    // 상태별 URL 및 payload 구성
    const isPausing = isStarted.value; // 현재 시작된 상태라면 "일시정지" 동작
    const url = isPausing
        ? `${apiUrl}/resultwork/update` // 일시정지 시 update
        : `${apiUrl}/resultwork/save`; // 시작 시 insert

    // 나중에 상태값 넣을때 필요하면 사용하면 됨
    // const statusMap = {
    //     START: { url: '/resultwork/save', status: 'START' },
    //     PAUSE: { url: '/resultwork/update', status: 'PAUSE' },
    //     RESUME: { url: '/resultwork/update', status: 'RESUME' },
    //     END: { url: '/resultwork/update', status: 'END' }
    // };

    // 서버로 보낼 데이터 준비
    const payload = [
        {
            // insert 할 데이터 정의해야됨
            workOrdNo: selectedWorkOrder.value.workOrdNo,
            modelCode: selectedWorkOrder.value.modelCode,
            revision: selectedWorkOrder.value.revision,
            proc_code: selectedWorkOrder.value.proc_code,
            ...(isPausing ? { workEndTime: formatDateForMySQL(new Date()), status: 'PAUSE' } : { workStartTime: formatDateForMySQL(new Date()), status: 'START' })
        }
    ];
    try {
        const response = await axios.post(url, payload);
        console.log('서버 응답:', response.data);

        if (!isPausing) {
            startTime.value = new Date(); // ✅ 시작시간 저장
            endTime.value = null;
            alert('✅ 작업이 시작되었습니다.');
        } else {
            alert('⏸ 작업이 일시정지되었습니다.');
        }

        // 상태 토글
        isStarted.value = !isStarted.value;
    } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error);
        alert('❌ 데이터 전송 실패');
    }
};

// 종료버튼 클릭 이벤트
const endButtonClick = async () => {
    startTime.value = '';
    // 작업이 시작되지 않았으면 종료 불가
    if (!isStarted.value) {
        alert('작업이 시작되지 않았습니다. 종료할 수 없습니다.');
        return;
    }

    // 서버로 보낼 데이터 준비
    const payload = [
        {
            workQty: selectedWorkOrder.value.workOrdQty,
            workEndTime: formatDateForMySQL(new Date()),
            workOrdNo: selectedWorkOrder.value.workOrdNo
        }
    ];
    console.log('저장 payload:', payload);

    try {
        const response = await axios.post(`${apiUrl}/resultwork/update`, payload);
        console.log('서버 응답:', response.data);

        endTime.value = new Date();

        alert('작업이 정상적으로 종료되었습니다.');

        // 시작 버튼으로 되돌리고 lot선택정보 초기화
        isStarted.value = false;
        selectedWorkOrder.value = [];
        bomList.value = {};
    } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error);
        alert('❌ 데이터 전송 실패');
    }
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
            <label for="workord" class="flex items-center col-span-2 mb-2">작업지시서</label>
            <InputText v-model="searchWorkOrdNo" class="col-span-9" id="workord" type="text" />
            <Button @click="openModalWithSearch" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center col-span-2 mb-2">LOT번호</label>
            <InputText v-model="searchLotNo" class="col-span-9" id="lotNo" type="text" />
            <Button @click="openModalWithLot" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
    </div>

    <!-- 작업지시서 조회 결과-->
    <div class="modalform card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="col-span-2">작업지시번호</label>
            <InputText v-model="selectedWorkOrder.workOrdNo" class="col-span-9" id="name3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업제품정보</label>
            <InputText :value="modelInfo" class="col-span-9" id="email3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="col-span-2">작업공정</label>
            <InputText v-model="selectedWorkOrder.proc" class="col-span-9" id="name3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업지시수량</label>
            <InputText v-model="selectedWorkOrder.workOrdQty" class="col-span-9" id="email3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">실작업수량</label>
            <InputText class="col-span-9" id="email3" type="text" />
        </div>
    </div>

    <!-- LOT번호 조회 결과-->
    <DataTable :value="bomList" v-model:selection="selectedLot" datakey="lotNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
        <Column field="itemCode" header="소요품번" style="min-width: 150px"></Column>
        <Column field="itemName" header="소요품명" style="min-width: 250px"></Column>
        <Column field="needQty" header="필요수량" style="min-width: 150px"></Column>
        <Column field="lotQty" header="준비수량" style="min-width: 150px"></Column>
        <Column header="초과량" style="min-width: 150px">
            <template #body="slotProps">
                {{ overQtyMap[slotProps.data.itemCode] || 0 }}
            </template>
        </Column>
        <Column field="unit" header="단위" style="min-width: 150px"></Column>
    </DataTable>

    <Dialog v-model:visible="openWorkOrdModal" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
        <WorkOrderModal :searchWorkOrdNo="searchWorkOrdNo" @workOrdreg="onSelectWorkOrd" />
    </Dialog>
    <Dialog v-model:visible="openLotModal" header="Lot번호 조회" modal style="width: 80vw; height: 80vh">
        <LotModal :searchLotNo="searchLotNo" @lotreg="onSelectLot" />
    </Dialog>

    <div class="buttons">
        <Button class="startbutton" :severity="buttonSeverity" raised @click="startButtonClick" :disabled="!isReady">
            <div class="flex flex-col items-center text-white">
                <span>{{ buttonLabel }}</span>
                <span>
                    작업시작시간 :
                    {{ startTime ? formatTime(startTime) : '-' }}
                </span>
            </div>
        </Button>
        <Button class="endbutton" severity="danger" raised @click="endButtonClick">
            <div class="flex flex-col items-center text-white">
                <span>작업종료</span>
                <span>
                    작업종료시간 :
                    {{ endTime ? formatTime(endTime) : '-' }}
                </span>
            </div>
        </Button>
    </div>
</template>

<style scoped>
.custom-table {
    height: 20vh;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 20px;
}
.buttons button {
    height: 15vh;
    width: 40vh;
}
.buttons {
    text-align: center;
}
.modalform {
    padding: 10px;
}
</style>
