<script setup>
import { ref, computed, watch } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';
import LotModal from '@/components/LotModal.vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
const workOrd = ref([]); // DataTable에 보여질 데이터
const formData = ref({}); // rowSelect 시 표시할 데이터

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

    // 선택된 modelCode, revision 이용해 BOM 조회 실행
    if (data.modelCode && data.revision) {
        await fetchBomList(data.modelCode, data.revision);
    }
};

// --------------------------------------- Bom 부분 ---------------------------------------
// 여러 작업지시 데이터 저장 그리드 연결
const bomList = ref([]);
// 필요수량 (작업지시서에서 받아옴)
const needQty = ref(0);

// BOM(Lot) 데이터 조회
const fetchBomList = async (modelCode, revision) => {
    try {
        // console.log('BOM 조회 요청:', modelCode, revision);
        const res = await axios.get(`${apiUrl}/resultwork/bomlist`, {
            params: { modelCode, revision }
        });
        // console.log('✅ BOM 조회 결과:', res.data);
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

// LOT번호 모달창 OPEN
const openModalWithLot = () => {
    console.log('🔍 부모 검색 버튼 클릭:', searchLotNo.value);
    openLotModal.value = true;
};

// 그리드에 쓸 lotQty 값 저장용
const selectedLotQty = ref(0);

// 모달에서 선택된 Lot정보 받아오기
const onSelectLot = (data) => {
    console.log('data: ', data);

    // bomList와 modelCode, revision 비교
    const checkBomMatch = (data) => {
        // 1단계: modelCode + revision 일치
        const sameModelRev = bomList.value.some((item) => item.modelCode === data.modelCode && item.revision === data.revision);

        if (sameModelRev) {
            console.log('modelCode + revision 완전 일치');
            return data.lotQty; // lotQty 리턴
        }

        // 2단계: itemCode 일치
        const sameItem = bomList.value.some((item) => item.itemCode === data.itemCode);

        if (sameItem) {
            console.log('modelCode/revision 불일치, itemCode만 일치');
            return data.lotQty; // lotQty 리턴
        }

        // 3단계: 아무것도 없으면 알림
        alert('일치하는 BOM 항목이 없습니다.');
        return null;
    };

    // 리턴받은 lotQty값
    const resultQty = checkBomMatch(data);
    console.log('🔍 checkBomMatch result:', resultQty);

    if (resultQty !== null) {
        selectedLotQty.value += Number(resultQty); // 변수에 저장

        console.log(`📦 새로 선택한 lotQty: ${resultQty}`);
        console.log(`🔢 누적된 lotQty: ${selectedLotQty.value}`);

        // 초과 여부 체크
        // if (selectedLotQty.value > needQty.value) {
        //     alert(`⚠️ 준비수량이 필요수량(${needQty.value})을 초과했습니다! (현재: ${selectedLotQty.value})`);
        // }
        // lot 데이터에 누적 추가
        // DataTable의 "준비수량" 칸에 즉시 반영 (예시: 첫 번째 행 기준)
        const targetBom = bomList.value.find((item) => item.itemCode === data.itemCode);
        if (targetBom) {
            // 기존 값이 있다면 누적, 없다면 초기값으로 세팅
            targetBom.lotQty = (targetBom.lotQty || 0) + Number(resultQty);
        }
        selectedLot.value = data;
        lot.value = [data];
        openLotModal.value = false;
    }
};

// 모달 닫힐 때 입력값 초기화
watch(openLotModal, (newVal) => {
    if (!newVal) {
        searchLotNo.value = '';
    }
});
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
        <Button class="cusbutton" label="시작" severity="success" raised />
        <!--<Button class="cusbutton col-span-4" label="일시정지" severity="warn" raised />-->
        <Button class="cusbutton" label="종료" severity="danger" raised />
    </div>
</template>

<style scoped>
.custom-table {
    height: 20vh;
    border: 1px solid #ddd;
    border-radius: 10px;
}
.cusbutton {
    height: 15vh;
    width: 50vh;
}
.buttons {
    margin: 0 auto;
}
.modalform {
    padding: 10px;
}
</style>
