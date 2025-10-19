<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
const selectedRow = ref(null);
const showForm = ref(null);

//선택된 행, 그리드 데이터
const selectedBmenu = ref(null);
const selectedSmenu = ref(null);

//왼쪽그리드 결과 담을 배열(대메뉴)
const leftGrid = ref([]);

//오른쪽그리드 결과 담을 배열(소메뉴)
const rightGrid = ref([]);

//const onBMenuSelect = ref([]);
const visible = ref(false); // ✅ Dialog 제어용

//폼데이터
const formData = ref({
    bMenuCode: '',
    bMenuName: '',
    sMenuCode: '',
    sMenuName: '',
    programName: ''
});

//초기화버튼
const onClearItemB = () => {
    formData.value = {
        bMenuCode: '',
        bMenuName: ''
    };
};
const onClearItemA = () => {
    formData.value = {
        sMenuCode: '',
        sMenuName: '',
        programName: ''
    };
};
// ✅ 신규 버튼 클릭 → 모달 열기
const openModal = () => {
    visible.value = true;
    formData.value = {
        bMenuCode: '',
        bMenuName: '',
        sMenuCode: '',
        sMenuName: '',
        programName: ''
    };
};

// 1️⃣ 전체 대메뉴 조회
onMounted(async () => {
    getTotalList();
});

const getTotalList = async () => {
    try {
        const result = await axios.get(`${apiUrl}/totalMenu/viewAll`);
        console.log('전체조회 결과:', result.data);

        leftGrid.value = result.data;

        // 첫 번째 행 자동 선택
        if (result.data && result.data.length > 0) {
            const firstRow = result.data[0];
            selectedRow.value = result.data[0]; // 왼쪽 테이블 첫 행 자동 선택
            formData.value = { ...firstRow };
        } else {
            selectedSmenu.value = null;
            selectedSmenu.value = { sMenuCode: '', sMenuName: '', programName: '' };
        }
    } catch (err) {
        console.error('대메뉴 조회 실패:', err);
    }
};

// ✅ 대메뉴 행 선택 시 실행
const onBMenuSelect = async (event) => {
    const row = event.data;
    console.log('선택된 대메뉴:', row);

    selectedBmenu.value = row;
    formData.value.bMenuCode = row.bMenuCode;
    formData.value.bMenuName = row.bMenuName;

    // 선택된 대메뉴에 해당하는 소메뉴 조회
    await getSubMenu(row.bMenuCode);
};

// ✅ 소메뉴 조회 함수
const getSubMenu = async (bMenuCode) => {
    try {
        console.log('소메뉴 조회 시작:', bMenuCode);
        const response = await axios.get(`${apiUrl}/totalMenu/subMenus`, {
            params: { bMenuCode }
        });
        console.log('소메뉴 결과:', response.data);
        rightGrid.value = response.data;
    } catch (err) {
        console.error('소메뉴 조회 실패:', err);
        rightGrid.value = [];
    }
};

//저장(등록)
const saveButton = async () => {
    const payload = {
        bMenuCode: formData.value.bMenuCode,
        bMenuName: formData.value.bMenuName,
        sMenuCode: formData.value.sMenuCode,
        sMenuName: formData.value.sMenuName,
        programName: formData.value.programName
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/totalMenu/insert`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    getTotalList();
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <!-- 🔹 상단 버튼 -->
            <div class="w-full flex justify-end gap-2">
                <Button label="신규" :fluid="false" @click="openModal"></Button>
                <Button label="저장" :fluid="false" @click="saveButton"></Button>
            </div>

            <!-- 🔹 등록용 모달 -->
            <Dialog v-model:visible="visible" header="메뉴 등록" modal class="w-[600px]">
                <div class="flex flex-col gap-6">
                    <!-- 🔸 대메뉴 입력 구역 -->
                    <section class="flex flex-col gap-3">
                        <h3 class="text-base font-semibold text-gray-700">대메뉴 그룹</h3>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm text-gray-600">대메뉴코드</label>
                            <InputText v-model="formData.bMenuCode" placeholder="예: IM1" class="w-full" />

                            <label class="text-sm text-gray-600">대메뉴명</label>
                            <InputText v-model="formData.bMenuName" placeholder="예: 자재관리" class="w-full" />
                        </div>

                        <!-- 🔹 대메뉴용 버튼 (초기화 / 저장) -->
                        <div class="flex justify-end gap-2 mt-2">
                            <Button label="초기화" icon="pi pi-refresh" severity="secondary" @click="onClearItemB" />
                            <Button label="저장" icon="pi pi-save" @click="saveButton" />
                        </div>
                    </section>

                    <hr />

                    <!-- 🔸 소메뉴 입력 구역 -->
                    <section class="flex flex-col gap-3">
                        <h3 class="text-base font-semibold text-gray-700">소메뉴 그룹</h3>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm text-gray-600">소메뉴코드</label>
                            <InputText v-model="formData.sMenuCode" placeholder="예: IMAPP" class="w-full" />

                            <label class="text-sm text-gray-600">소메뉴명</label>
                            <InputText v-model="formData.sMenuName" placeholder="예: 자재계획등록" class="w-full" />

                            <label class="text-sm text-gray-600">프로그램명</label>
                            <InputText v-model="formData.programName" placeholder="예: addProdPlan.vue" class="w-full" />
                        </div>
                    </section>
                </div>

                <!-- 🔹 Dialog 하단 Footer -->
                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button label="초기화" icon="pi pi-refresh" severity="secondary" @click="onClearItemA" />
                        <Button label="저장" icon="pi pi-save" @click="saveButton" />
                    </div>
                </template>
            </Dialog>

            <!-- 하단: 좌/우 그리드 -->
            <div class="flex gap-4 w-full h-[620px]">
                <!-- 왼쪽 그리드 -->
                <div class="flex-1 border rounded p-2 overflow-auto">
                    <DataTable :value="leftGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="onBMenuSelect" dataKey="bMenuCode">
                        <Column field="bMenuCode" header="대그룹코드"></Column>
                        <Column field="bMenuName" header="대메뉴명"></Column>
                    </DataTable>
                </div>

                <!-- 오른쪽 그리드 -->
                <div class="flex-1 border rounded p-2 overflow-auto">
                    <DataTable :value="rightGrid" v-model:selection="selectedSmenu" selectionMode="single" class="w-full" dataKey="sMenuCode">
                        <Column field="sMenuCode" header="소메뉴코드"></Column>
                        <Column field="sMenuName" header="소메뉴명"></Column>
                        <Column field="programName" header="프로그램명"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
