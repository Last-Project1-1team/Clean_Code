<script setup>
import { ref, computed, watch } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';
import LotModal from '@/components/LotModal.vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();

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

// LOT번호 모달창 OPEN
const openModalWithLot = () => {
    // 모달창 open 시 lot 선택 초기화
    selectedLot.value = null;
    console.log('부모 검색 버튼 클릭:', searchLotNo.value);
    openLotModal.value = true;
};

// 그리드에 쓸 lotQty 값 저장용
const selectedLotQty = ref(0);

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

    // needQty 초과 시 차단
    if (newTotal > needQty) {
        const over = newTotal - needQty;
        alert(`⚠️ ${targetBom.itemCode}의 Lot 수량이 필요수량(${needQty})을 초과했습니다. 초과량: ${over}`);
        return;
    }

    // 중복 아니고 초과도 아니면 lot 선택 반영
    // 선택된 lot번호 저장
    selectedLotNos.value.push(data.lotNo);

    // 누적 로직
    selectedLotQty.value += Number(resultQty);
    targetBom.lotQty = newTotal;

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
const isReady = ref(false);

// computed 속성으로 버튼의 severity와 label을 동적
const buttonSeverity = computed(() => (isStarted.value ? 'warn' : 'success'));
const buttonLabel = computed(() => (isStarted.value ? '일시정지' : '시작'));

// start버튼 클릭 이벤트
const startButtonClick = async () => {
    // 버튼 활성화
    isReady.value = true;
    // 서버로 보낼 데이터 준비
    const payload = [
        {
            // insert 할 데이터 정의해야됨
            work_ord_no: selectedWorkOrder.value.workOrdNo,
            model_code: selectedWorkOrder.value.modelCode,
            revision: selectedWorkOrder.value.revision,
            proc_code: selectedWorkOrder.value.procCode,
            work_qty: selectedWorkOrder.value.proc_ode,
            work_start_time: new Date().toISOString(),
            work_end_time: new Date().toISOString()
        }
    ];

    try {
        // 🎈 Axios를 사용해서 서버 API에 POST 요청을 보내!
        // '/api/insert-data'는 네 백엔드 서버의 실제 API 주소로 바꿔야 해.
        const response = await axios.post(`${apiUrl}/resultwork/save`, payload);

        console.log('서버 응답:', response.data);

        // ⭐ 서버 통신이 성공하면 isStarted 값을 토글해줘! (반드시 .value!)
        isStarted.value = !isStarted.value;
        alert('데이터 전송 성공');
    } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error);
        alert('데이터 전송 실패');
    } finally {
        isReady.value = false;
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
            <InputText v-model="selectedWorkOrder.workOrdNo" class="col-span-9" id="name3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업제품정보</label>
            <InputText :value="modelInfo" class="col-span-9" id="email3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="col-span-2">작업공정</label>
            <InputText v-model="selectedWorkOrder.proc" class="col-span-9" id="name3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업수량</label>
            <InputText v-model="selectedWorkOrder.workOrdQty" class="col-span-9" id="email3" type="text" />
        </div>
    </div>

    <!-- LOT번호 조회 결과-->
    <DataTable :value="bomList" v-model:selection="selectedLot" datakey="lotNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
        <Column field="itemCode" header="소요품번" style="min-width: 150px"></Column>
        <Column field="itemName" header="소요품명" style="min-width: 250px"></Column>
        <Column field="needQty" header="필요수량" style="min-width: 150px"></Column>
        <Column field="lotQty" header="준비수량" style="min-width: 150px"></Column>
        <Column field="unit" header="단위" style="min-width: 150px"></Column>
    </DataTable>

    <Dialog v-model:visible="openWorkOrdModal" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
        <WorkOrderModal :searchWorkOrdNo="searchWorkOrdNo" @workOrdreg="onSelectWorkOrd" />
    </Dialog>
    <Dialog v-model:visible="openLotModal" header="Lot번호 조회" modal style="width: 80vw; height: 80vh">
        <LotModal :searchLotNo="searchLotNo" @lotreg="onSelectLot" />
    </Dialog>

    <div class="buttons">
        <Button class="startbutton" :label="buttonLabel" :severity="buttonSeverity" raised @click="startButtonClick" :disabled="isReady" />
        <Button class="endbutton" label="종료" severity="danger" raised />
    </div>
</template>

<style scoped>
.custom-table {
    height: 20vh;
    border: 1px solid #ddd;
    border-radius: 10px;
}
.buttons button {
    height: 15vh;
    width: 50vh;
}
.buttons {
    text-align: center;
}
.modalform {
    padding: 10px;
}
</style>
