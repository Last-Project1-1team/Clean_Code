<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ModalSearchModel from '@/components/ModalSearchModel.vue';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
// 제품 검색 모달
const ModalSearch = ref(false);

// 날짜 데이터 포멧
const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// 공정드롭다운
// const procDropDown = ref([]);
const prodPlan = ref([]);
const totalInordQty = ref(0);
// 그리드 선택 행 정보 저장
const selectedPlans = ref([]);

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/prodplan/proc`);
    if (response.data.length > 0) {
        const proc = response.data[0];
        formData.value.process.procCode = proc.code;
        formData.value.process.procName = proc.name; // InputText로 표시될 값
    }
});

// 모달에서 가져온 제품정보
const handleModelRegister = (data) => {
    formData.value.product.modelCode = data.modelCode;
    formData.value.product.revision = data.revision;
    formData.value.product.modelName = data.modelName;
    ModalSearch.value = false;
};

// 입력폼 데이터가 담기는 곳
const formData = ref({
    planPeriod: {
        startDate: new Date(),
        endDate: new Date()
    },
    product: {
        modelCode: '',
        revision: '',
        modelName: ''
    },
    process: {
        procCode: null
    },
    totalInordQty: 0,
    totalShipQty: 0,
    unshippedQty: 0
});

// 초기화 버튼 이벤트
const initPlan = () => {
    formData.value.planPeriod = {
        startDate: new Date(),
        endDate: new Date()
    };
    formData.value.product = {
        modelCode: '',
        revision: '',
        modelName: ''
    };
    formData.value.totalInordQty = 0;
    formData.value.unshippedQty = 0;
    // formData.value.process는 건드리지 않음 → procCode 유지됨
};

// 수주량, 출하량 조회 후 그리드에 반영
const fetchOrderQty = async (modelCode, revision) => {
    if (!modelCode || !revision) {
        formData.value.totalInordQty = 0;
        formData.value.totalShipQty = 0;
        formData.value.unshippedQty = 0;
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}/prodplan/inordqty`, {
            params: { modelCode, revision }
        });

        const data = response.data && response.data.length > 0 ? response.data[0] : null;

        const totalInordQty = data ? data.totalInordQty || 0 : 0;
        const totalShipQty = data ? data.totalShipQty || 0 : 0;

        // console.log('총 출하량 totalShipQty:', totalShipQty);
        // console.log('총 수주량 totalInordQty:', totalInordQty);

        formData.value.totalInordQty = totalInordQty;
        formData.value.totalShipQty = totalShipQty;
        formData.value.unshippedQty = totalInordQty - totalShipQty; // 미 출하수량 계산
    } catch (err) {
        console.error('수주 및 출하량 조회 중 오류:', err);
        formData.value.totalInordQty = 0;
        formData.value.totalShipQty = 0;
        formData.value.unshippedQty = 0;
    }
};

// 입력 버튼 이벤트
const addPlan = async () => {
    // 필수 값 검증
    if (!formData.value.product.modelCode || !formData.value.product.revision || !formData.value.process.procCode || !formData.value.planPeriod.startDate || !formData.value.planPeriod.endDate) {
        toast.add({
            severity: 'warn',
            summary: '입력 오류',
            detail: '모든 필수 항목을 입력해주세요.',
            life: 3000
        });
        return; // 함수 실행 중단
    }

    // 수주량 조회 그리드의 Qty에 사용
    await fetchOrderQty(formData.value.product.modelCode, formData.value.product.revision, formData.value.process.procCode);

    // dataTable의 prodPlan에 추가할 데이터 객체 생성
    const newPlanItem = {
        // formData에서 가져온 데이터를 DataTable 컬럼에 사용
        regPlanDate: new Date().toISOString().split('T')[0], // 현재 날짜
        startPlanDate: formData.value.planPeriod.startDate ? formData.value.planPeriod.startDate.toISOString().split('T')[0] : null,
        endPlanDate: formData.value.planPeriod.endDate ? formData.value.planPeriod.endDate.toISOString().split('T')[0] : null,
        modelCode: formData.value.product.modelCode,
        revision: formData.value.product.revision,
        modelName: formData.value.product.modelName,

        // 공정
        procName: formData.value.process.procName,

        totalInordQty: formData.value.totalInordQty,
        unshippedQty: formData.value.unshippedQty,

        // 계획수량(planQty)은 그리드에서 입력할 예정이므로 0 또는 null로 초기화
        planQty: 0 // 또는 null, 사용자 입력 대기
    };

    // prodPlan 배열에 입력받은 데이터들 추가
    prodPlan.value.push(newPlanItem);

    // 성공 알림 추가
    toast.add({
        severity: 'success',
        summary: '입력 성공',
        detail: '입력이 완료되었습니다.',
        life: 3000
    });

    // 폼 초기화
    // initPlan();
};

// 선택된 행 처리 함수
const checkon = (rowData) => {
    const index = selectedPlans.value.findIndex((p) => p.modelCode === rowData.modelCode && p.revision === rowData.revision);
    if (index === -1) {
        selectedPlans.value.push(rowData); // 없으면 추가
    } else {
        selectedPlans.value.splice(index, 1); // 이미 있으면 제거 (토글)
    }
};

// 저장 버튼 이벤트
const insertPlan = async () => {
    console.log('🟢 insertPlan 호출됨');
    console.log('selectedPlans:', selectedPlans);
    console.log('selectedPlans.value 타입:', typeof selectedPlans.value);
    console.log('selectedPlans.value:', selectedPlans.value);
    try {
        // 그리드에 데이터가 없으면 알림
        if (!selectedPlans.value || selectedPlans.value.length === 0) {
            toast.add({ severity: 'warn', summary: '알림', detail: '저장할 데이터가 없습니다. 먼저 계획을 입력해주세요.', life: 3000 });
            return;
        }

        // 성공 및 실패 카운터
        let successCount = 0;
        let failCount = 0;

        const plans = Array.isArray(selectedPlans.value) ? selectedPlans.value : [selectedPlans.value]; // 객체라면 배열로 감싸기

        // 그리드의 각 행을 순회하면서 서버에 저장
        for (const plan of selectedPlans.value) {
            console.log('🟡 처리 중인 plan:', plan);
            // 서버에 전송할 형태로 데이터 가공
            const planData = {
                createDate: plan.regPlanDate,
                startDate: plan.startPlanDate,
                endDate: plan.endPlanDate,
                planQty: plan.planQty,
                modelCode: plan.modelCode,
                revision: plan.revision,
                procCode: formData.value.process.procCode
            };

            console.log('🔵 전송할 planData:', planData);

            // 필수 데이터 검증
            if (!planData.planQty) {
                failCount++;
                continue; // 계획수량이 없으면 건너뛰기
            }

            console.log(`✅ 저장 완료 - 성공 ${successCount}건 / 실패 ${failCount}건`);

            try {
                // 서버에 POST 요청 보내기
                await axios.post(`${apiUrl}/prodplan/save`, planData);
                successCount++;
            } catch (err) {
                console.error('계획 저장 중 오류:', err);
                console.log('selectedPlans.value (오류시점):', selectedPlans.value);
                failCount++;
            }
        }

        // 결과 메시지 표시
        if (successCount > 0) {
            toast.add({
                severity: 'success',
                summary: '저장 성공',
                detail: `${successCount}건의 생산계획이 저장되었습니다.${failCount > 0 ? `\n${failCount}건은 저장에 실패했습니다.` : ''}`,
                life: 3000
            });

            // 저장 성공 후 그리드 초기화 또는 새로고침
            prodPlan.value = [];
        } else {
            toast.add({
                severity: 'error',
                summary: '저장 실패',
                detail: '생산계획 저장에 실패했습니다. 계획 수량을 입력해주세요.',
                life: 3000
            });
        }
    } catch (err) {
        console.error('생산계획 저장 중 오류 발생:', err);
        toast.add({
            severity: 'error',
            summary: '오류 발생',
            detail: '생산계획 저장 중 오류가 발생했습니다.',
            life: 3000
        });
    }
};

// 삭제 버튼 이벤트
const deletePlan = () => {
    // 선택된 항목이 있는지 확인
    if (!selectedPlans.value || selectedPlans.value.length === 0) {
        // PrimeVue Toast를 사용하는 경우
        toast.add({
            severity: 'warn',
            summary: '알림',
            detail: '삭제할 행을 선택해주세요.',
            life: 3000
        });
        return;
    }
    // 선택된 항목들을 prodPlan 배열에서 제거
    selectedPlans.value.forEach((selectedItem) => {
        const index = prodPlan.value.findIndex((item) => item.prodPlanNo === selectedItem.prodPlanNo);
        if (index !== -1) {
            prodPlan.value.splice(index, 1);
        }
    });

    // 선택 초기화
    selectedPlans.value = [];

    // 삭제 완료 알림
    toast.add({
        severity: 'success',
        summary: '삭제 완료',
        detail: '선택한 행이 삭제되었습니다.',
        life: 3000
    });
};
</script>
<template>
    <div class="card">
        <Toolbar class="mb-6 relative">
            <template #start>
                <div class="grid grid-cols-12 gap-2 w-full">
                    <!-- 계획시작일 -->
                    <label for="startPlan" class="flex items-center col-span-1">계획시작일</label>
                    <div class="col-span-3">
                        <DatePicker id="startPlan" :showIcon="true" :showButtonBar="true" v-model="formData.planPeriod.startDate" date-format="yy-mm-dd" style="width: 250px" />
                    </div>

                    <!-- 계획종료일 -->
                    <label for="endPlan" class="flex items-center col-span-1">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker id="endPlan" :showIcon="true" :showButtonBar="true" v-model="formData.planPeriod.endDate" date-format="yy-mm-dd" />
                    </div>

                    <div class="col-span-5"></div>

                    <!-- 제품코드 -->
                    <label for="modelCode" class="flex items-center col-span-1">제품코드</label>
                    <div class="col-span-3 flex items-center gap-1">
                        <InputText v-model="formData.product.modelCode" id="modelCode" type="text" style="width: 175px" readonly />
                        <Button @click="ModalSearch = true" icon="pi pi-search" class="lensButton p-button-success" />
                    </div>

                    <!-- 리비전 -->
                    <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-2"><InputText v-model="formData.product.revision" id="revision" type="text" class="w-full" readonly /></div>

                    <div class="col-span-5"></div>

                    <!-- 제품명 -->
                    <label for="modelName" class="flex items-center col-span-1">제품명</label>
                    <div class="col-span-3">
                        <InputText v-model="formData.product.modelName" id="modelName" type="text" style="width: 210px" readonly />
                    </div>

                    <!-- 공정선택 -->
                    <label for="selectProc" class="flex items-center col-span-1">최종공정</label>
                    <div class="col-span-2">
                        <!-- <Select v-model="formData.process.procCode" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" id="selectProc" class="w-full" /> -->
                        <InputText v-model="formData.process.procName" id="selectProc" class="w-full" readonly />
                    </div>

                    <!-- ✅ 버튼 그룹들: 툴바 전체 기준 -->
                    <div class="absolute top-3 right-4 flex gap-2">
                        <Button label="초기화" class="p-button-outlined px-5 py-2 font-bold" @click="initPlan" />
                        <Button label="입력" class="p-button-success px-5 py-2 font-bold" @click="addPlan" />
                        <Button label="저장" class="p-button-success px-5 py-2 font-bold" @click="insertPlan" />
                    </div>

                    <div class="absolute bottom-3 right-4">
                        <Button label="삭제" icon="pi pi-trash" class="deleteButton p-button-danger px-4 py-2 font-bold" @click="deletePlan" />
                    </div>
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable v-model:selection="selectedPlans" :value="prodPlan" selectionMode="multiple" scrollable scrollHeight="63.8vh" style="border: 1px solid #ddd; height: 63.8vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <!-- <Column field="regPlanDate" header="계획등록일자" sortable style="min-width: 10rem"></Column> -->
            <Column field="startPlanDate" header="계획시작일자" sortable style="min-width: 10rem"></Column>
            <Column field="endPlanDate" header="계획종료일자" sortable style="min-width: 10em"></Column>
            <Column field="planQty" header="계획수량" sortable style="min-width: 12rem">
                <template #body="{ data }">
                    <input v-model.number="data.planQty" type="number" min="0" step="1" class="w-40 border p-1" @blur="checkon(data)" />
                </template>
            </Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 10rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 8rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 10rem"></Column>
            <Column field="procName" header="최종공정" sortable style="min-width: 8rem"></Column>
            <Column field="totalInordQty" header="수주량" sortable style="min-width: 9rem"></Column>
            <Column field="unshippedQty" header="미 출하량" sortable style="min-width: 9rem"></Column>
        </DataTable>

        <Dialog v-model:visible="ModalSearch" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>
    </div>
</template>
<style scoped>
button {
    margin-right: 2px;
    width: 100px;
    height: 50px;
}
.lensButton {
    width: 32px;
    height: 32px;
}
.deleteButton {
    width: 100px;
    height: 30px;
}
</style>
