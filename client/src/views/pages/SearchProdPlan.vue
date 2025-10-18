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
    if (!date) return ''; // null이나 undefined일 경우 공백 문자열 반환
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/prodplan/proc`);
    procDropDown.value = response.data.map((proc) => ({
        label: proc.name, // 보여줄 이름
        value: proc.code // 실제 값
    }));
});

const startPlanDate = ref(null);
const endPlanDate = ref(null);
const regPlanDate = ref(null);
const selectedModel = ref({});
// 공정드롭다운
const procDropDown = ref([]);
const searchData = ref({});
const selectedData = ref({});
const prodPlan = ref([]);

// 모달에서 가져온 제품정보
const handleModelRegister = (data) => {
    selectedModel.value = data; // 제품 전체 정보 저장
    ModalSearch.value = false;
};

const getProdList = async (searchParams) => {
    try {
        prodPlan.value = [];

        const response = await axios.get(`${apiUrl}/prodplan`, {
            params: {
                regPlanDate: searchParams.regPlanDate, // 객체에서 값을 꺼내서 사용
                startPlanDate: searchParams.startPlanDate,
                endPlanDate: searchParams.endPlanDate,
                modelCode: searchParams.modelCode,
                revision: searchParams.revision,
                procCode: searchParams.procCode
            }
        });

        // 응답 데이터가 배열인지 확인하고 할당
        if (Array.isArray(response.data)) {
            prodPlan.value = response.data;
        } else {
            console.warn('서버 응답이 예상된 배열 형태가 아닙니다:', response.data);
            // 배열이 아니면 빈 배열로 설정하거나, 오류 처리
            prodPlan.value = [];
        }
    } catch (err) {
        console.error('제품 조회 실패:', err);
        // 오류 발생 시 prodPlan을 빈 배열로 유지하거나 사용자에게 알림
        prodPlan.value = [];
    }
};

// 조회 버튼 이벤트
const searchPlan = () => {
    selectedData.value = {
        regPlanDate: regPlanDate.value ? formatDate(regPlanDate.value) : '',
        startPlanDate: startPlanDate.value ? formatDate(startPlanDate.value) : '',
        endPlanDate: endPlanDate.value ? formatDate(endPlanDate.value) : '',
        modelCode: selectedModel.value.modelCode || '',
        revision: selectedModel.value.revision || '',
        procCode: searchData.value.procCode || ''
    };
    // getProdList 함수를 호출할 때 selectedData.value를 인자로 넘겨줌
    getProdList(selectedData.value);
};

// 초기화 버튼 이벤트
const initPlan = () => {
    regPlanDate.value = null;
    startPlanDate.value = null;
    endPlanDate.value = null;
    selectedModel.value = {};
    searchData.value = {};
    selectedData.value = {};
};
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-4 items-center">
                    <!-- 1번째 줄: 계획등록일 -->
                    <label for="regPlan" class="flex items-center col-span-2">계획등록일</label>
                    <div class="col-span-4">
                        <DatePicker v-model="regPlanDate" id="regPlan" :showIcon="true" :showButtonBar="true" date-format="yy-mm-dd" class="w-full" />
                    </div>
                    <div class="col-span-6"></div>
                    <!-- 빈 공간 -->

                    <!-- 2번째 줄: 계획시작일, 계획종료일 -->
                    <label for="startPlan" class="flex items-center col-span-2">계획시작일</label>
                    <div class="col-span-4">
                        <DatePicker v-model="startPlanDate" id="startPlan" :showIcon="true" :showButtonBar="true" date-format="yy-mm-dd" class="w-full" />
                    </div>
                    <label for="endPlan" class="flex items-center col-span-2">계획종료일</label>
                    <div class="col-span-4">
                        <DatePicker v-model="endPlanDate" id="endPlan" :showIcon="true" :showButtonBar="true" date-format="yy-mm-dd" class="w-full" />
                    </div>

                    <!-- 3번째 줄: 제품코드, 리비전 -->
                    <label for="modelCode" class="flex items-center col-span-2">제품코드</label>
                    <div class="col-span-4 flex">
                        <InputText v-model="selectedModel.modelCode" id="modelCode" class="flex-grow mr-2" />
                        <Button @click="ModalSearch = true" icon="pi pi-search" />
                    </div>
                    <label for="revision" class="flex items-center col-span-2">리비전</label>
                    <div class="col-span-4">
                        <InputText v-model="selectedModel.revision" id="revision" class="w-full" />
                    </div>

                    <!-- 4번째 줄: 제품명, 공정선택 -->
                    <label for="modelName" class="flex items-center col-span-2">제품명</label>
                    <div class="col-span-4">
                        <InputText v-model="selectedModel.modelName" id="modelName" class="w-full" />
                    </div>
                    <label for="selectProc" class="flex items-center col-span-2">공정선택</label>
                    <div class="col-span-4">
                        <Select v-model="searchData.procCode" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" id="selectProc" class="w-full" />
                    </div>
                </div>
            </template>

            <template #end>
                <div class="flex space-x-2">
                    <Button label="초기화" @click="initPlan" />
                    <Button label="조회" @click="searchPlan" />
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable :value="prodPlan" dataKey="prodPlanNo" :rows="10" style="border: 1px solid #ddd; height: 60vh">
            <Column field="regPlanDate" header="계획등록일자" sortable style="min-width: 12rem"></Column>
            <Column field="startPlanDate" header="계획시작일자" sortable style="min-width: 12rem"></Column>
            <Column field="endPlanDate" header="생산종료일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="procName" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="Qty" header="수주량" sortable style="min-width: 12rem"></Column>
            <Column field="planQty" header="계획수량" sortable style="min-width: 16rem"></Column>
            <Column field="unit" header="단위" sortable style="min-width: 16rem"></Column>
        </DataTable>

        <Dialog v-model:visible="ModalSearch" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>
    </div>
</template>
