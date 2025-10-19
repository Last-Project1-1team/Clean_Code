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
const procDropDown = ref([]);
const prodPlan = ref([]);
const totalInordQty = ref(0);
// 그리드 선택 행 정보 저장
const selectedPlans = ref([]);

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/prodplan/proc`);
    procDropDown.value = response.data.map((proc) => ({
        label: proc.name, // 보여줄 이름
        value: proc.code // 실제 값
    }));
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
    totalInordQty: 0
});

// 초기화 버튼 이벤트
const initPlan = () => {
    formData.value = {
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
        totalInordQty: 0
    };
};

// 수주량 조회 후 그리드에 반영
const fetchOrderQty = async (modelCode, revision, procCode) => {
    if (!modelCode || !revision || !procCode) {
        formData.value.totalInordQty = 0; // ✨ 여기도 변경
        return;
    }

    try {
        const response = await axios.get(`${apiUrl}/prodplan/inordqty`, {
            params: {
                modelCode,
                revision,
                procCode
            }
        });

        const fetchedQty =
            response.data && response.data.length > 0
                ? response.data[0].totalInordQty // DB 쿼리에서 넘어오는 이름
                : 0;

        formData.value.totalInordQty = fetchedQty; // ✨ 여기도 변경
    } catch (err) {
        console.error('수주량 조회 중 오류:', err);
        formData.value.totalInordQty = 0; // ✨ 여기도 변경
    }
};

// 수주량 조회 후 formData에 반영
const updateOrderQty = (qty) => {
    formData.value.product.totalInordQty = qty; // 또는 formData.value.totalInordQty = qty;
};

// 입력 버튼 이벤트
// 입력 버튼 이벤트
const addPlan = async () => {
    // 수주량 조회 그리드의 Qty에 사용 (여전히 이전에 전달된 searchParams 기준으로 조회됨)
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
        procName: procDropDown.value.find((proc) => proc.value === formData.value.process.procCode)?.label,

        totalInordQty: formData.value.totalInordQty, // ✨ Qty 대신 totalInordQty 사용 및 formData 경로 변경

        // 계획수량(planQty)은 그리드에서 입력할 예정이므로 0 또는 null로 초기화
        planQty: 0 // 또는 null, 사용자 입력 대기
    };

    // prodPlan 배열에 입력받은 데이터들 추가
    prodPlan.value.push(newPlanItem);

    // 폼 초기화
    initPlan();
};

// 저장 버튼 이벤트
const insertPlan = async () => {
    try {
        // 그리드에 데이터가 없으면 알림
        if (!prodPlan.value || prodPlan.value.length === 0) {
            toast.add({ severity: 'warn', summary: '알림', detail: '저장할 데이터가 없습니다. 먼저 계획을 입력해주세요.', life: 3000 });
            return;
        }

        // 성공 및 실패 카운터
        let successCount = 0;
        let failCount = 0;

        // 그리드의 각 행을 순회하면서 서버에 저장
        for (const plan of prodPlan.value) {
            // 서버에 전송할 형태로 데이터 가공
            const planData = {
                createDate: plan.regPlanDate,
                startDate: plan.startPlanDate,
                endDate: plan.endPlanDate,
                planQty: plan.planQty,
                modelCode: plan.modelCode,
                revision: plan.revision,
                procCode: procDropDown.value.find((proc) => proc.label === plan.procName)?.value
            };

            // 필수 데이터 검증
            if (!planData.planQty) {
                failCount++;
                continue; // 계획수량이 없으면 건너뛰기
            }

            try {
                // 서버에 POST 요청 보내기
                await axios.post(`${apiUrl}/prodplan/save`, planData);
                successCount++;
            } catch (err) {
                console.error('계획 저장 중 오류:', err);
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
                detail: '생산계획 저장에 실패했습니다.',
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
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="startPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획시작일</label>
                    <div class="col-span-3">
                        <DatePicker id="startPlan" :showIcon="true" :showButtonBar="true" v-model="formData.planPeriod.startDate" date-format="yy-mm-dd" style="width: 250px"></DatePicker>
                    </div>

                    <label for="endPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker id="endPlan" :showIcon="true" :showButtonBar="true" v-model="formData.planPeriod.endDate" date-format="yy-mm-dd"></DatePicker>
                    </div>

                    <div class="col-span-2"></div>

                    <Button label="초기화" @click="initPlan"></Button>
                    <Button label="입력" @click="addPlan"></Button>
                    <Button label="저장" @click="insertPlan"></Button>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
                    <div class="col-span-3">
                        <InputText v-model="formData.product.modelCode" id="modelName" type="text" style="width: 175px" />
                        <Button @click="ModalSearch = true" class="w-full" type="button" icon="pi pi-search" />
                    </div>
                    <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-2">
                        <InputText v-model="formData.product.revision" id="revision" type="text" class="w-full" />
                    </div>

                    <div class="col-span-5"></div>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
                    <div class="col-span-3">
                        <InputText v-model="formData.product.modelName" id="modelName" type="text" style="width: 210px" />
                    </div>
                    <label for="selectProc" class="flex items-center col-span-1">공정선택</label>
                    <div class="col-span-2">
                        <Select v-model="formData.process.procCode" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" id="selectProc" class="w-full" />
                    </div>

                    <div class="col-span-4"></div>
                    <Button label="삭제" @click="deletePlan"></Button>
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable v-model:selection="selectedPlans" :value="prodPlan" dataKey="prodPlanNo" :rows="10" style="border: 1px solid #ddd; height: 60vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="regPlanDate" header="계획등록일자" sortable style="min-width: 12rem"></Column>
            <Column field="startPlanDate" header="계획시작일자" sortable style="min-width: 12rem"></Column>
            <Column field="endPlanDate" header="생산종료일자" sortable style="min-width: 12rem"></Column>
            <Column field="planQty" header="계획수량" sortable style="min-width: 16rem">
                <template #body="{ data }">
                    <input v-model.number="data.planQty" type="number" min="0" step="1" class="w-40 border p-1" />
                </template>
            </Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="procName" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="totalInordQty" header="수주량" sortable style="min-width: 12rem"></Column>
            <Column field="nonOutQty" header="미 출고량" sortable style="min-width: 12rem"></Column>
        </DataTable>

        <Dialog v-model:visible="ModalSearch" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>
    </div>
</template>
