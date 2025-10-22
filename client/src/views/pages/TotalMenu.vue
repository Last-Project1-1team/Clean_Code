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
const selectedSubRow = ref(null);

// 사용자가 선택한 대메뉴 정보
const selecteBMenuModal = ref(null);
const changeBMenu = (event) => {
    const selected = event.value;
    formData.value.bMenuCode = selected.bMenuCode;
    formData.value.bMenuName = selected.bMenuName;
    // 소메뉴 폼 필드는 초기화
    formData.value.sMenuCode = '';
    formData.value.sMenuName = '';
    formData.value.programName = '';
};

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
        bMenuName: '',
        sMenuCode: '',
        sMenuName: '',
        programName: ''
    };
};
const onClearItemA = () => {
    formData.value = {
        bMenuCode: '',
        bMenuName: '',
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

            // 첫 번째 대메뉴에 대한 소메뉴도 같이 조회
            await getSubMenu(firstRow.bMenuCode);
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

// 대메뉴 저장 시 중복 및 빈값 체크 후 저장
const saveBMenuButton = async () => {
    // 입력값 검증
    if (!formData.value.bMenuCode?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '대메뉴 코드를 입력하세요', life: 3000 });
        return;
    }
    if (!formData.value.bMenuName?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '대메뉴 이름을 입력하세요', life: 3000 });
        return;
    }

    // 중복 체크
    const isDuplicate = leftGrid.value.some((item) => item.bMenuCode === formData.value.bMenuCode);
    if (isDuplicate) {
        toast.add({ severity: 'warn', summary: '중복 오류', detail: '이미 존재하는 대메뉴 코드입니다', life: 3000 });
        return;
    }

    const payload = {
        bMenuCode: formData.value.bMenuCode,
        bMenuName: formData.value.bMenuName
    };

    console.log('저장 payload:', payload);

    try {
        const result = await axios.post(`${apiUrl}/totalMenu/insertBMenu`, payload);

        console.log('서버 응답 전체:', result);
        console.log('서버 응답 데이터:', result.data);

        if (result?.data?.success) {
            toast.add({
                severity: 'success',
                summary: '저장 완료',
                detail: result.data.message || '대메뉴가 성공적으로 저장되었습니다',
                life: 3000
            });

            formData.value = {
                bMenuCode: '',
                bMenuName: '',
                sMenuCode: '',
                sMenuName: '',
                programName: ''
            };

            await getTotalList(true);

            // 2. 그 후 formData 강제로 초기화
            formData.value = { ...onClearItemA };
            selectedRow.value = null;
        } else {
            toast.add({
                severity: 'error',
                summary: '저장 실패',
                detail: result?.data?.message || '저장 중 오류가 발생했습니다',
                life: 3000
            });
        }
    } catch (error) {
        console.error('저장 오류:', error);

        let msg = '서버 오류가 발생했습니다.';
        if (error.response?.data) {
            const serverResponse = error.response.data;
            if (serverResponse.errno === 1062 || (serverResponse.sqlMessage && serverResponse.sqlMessage.toLowerCase().includes('duplicate'))) {
                msg = '중복된 대메뉴 코드입니다. 다른 코드를 사용해주세요.';
            } else if (serverResponse.message) {
                msg = serverResponse.message;
            }
        }

        toast.add({
            severity: 'error',
            summary: '저장 실패',
            detail: msg,
            life: 4000
        });
    }
};

// 소메뉴 저장 시 중복 및 빈값 체크 후 저장
const saveSMenuButton = async () => {
    if (!formData.value.bMenuCode?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '대메뉴 코드를 선택하세요', life: 3000 });
        return;
    }
    if (!formData.value.sMenuCode?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '소메뉴 코드를 입력하세요', life: 3000 });
        return;
    }
    if (!formData.value.sMenuName?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '소메뉴 이름을 입력하세요', life: 3000 });
        return;
    }
    // 프로그램명 필수 검증 추가
    if (!formData.value.programName?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '프로그램명을 입력하세요', life: 3000 });
        return;
    }

    const isDuplicate = rightGrid.value.some((item) => item.bMenuCode === formData.value.bMenuCode && item.sMenuCode === formData.value.sMenuCode);
    if (isDuplicate) {
        toast.add({ severity: 'warn', summary: '중복 오류', detail: '이미 존재하는 소메뉴 코드입니다', life: 3000 });
        return;
    }

    const payload = {
        bMenuCode: formData.value.bMenuCode,
        sMenuCode: formData.value.sMenuCode,
        sMenuName: formData.value.sMenuName,
        programName: formData.value.programName
    };

    try {
        const res = await axios.post(`${apiUrl}/totalMenu/insertSMenu`, payload);
        console.log('응답 데이터:', res.data);

        if (res.data.success) {
            toast.add({ severity: 'success', summary: '저장 완료', detail: res.data.message, life: 3000 });

            await getSubMenu(formData.value.bMenuCode, true);

            formData.value.sMenuCode = '';
            formData.value.sMenuName = '';
            formData.value.programName = '';
            selectedSubRow.value = null;
        } else {
            toast.add({
                severity: 'error',
                summary: '저장 실패',
                detail: res.data.message || '알 수 없는 오류',
                life: 3000
            });
        }
    } catch (error) {
        console.error('catch 실행됨:', error);
        toast.add({
            severity: 'error',
            summary: '저장 실패',
            detail: '서버 오류가 발생했습니다.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <!-- 🔹 상단 버튼 -->
            <div class="w-full flex justify-end gap-2">
                <Button label="신규" :fluid="false" class="p-button-success px-6 py-3 text-lg font-bold" @click="openModal"></Button>
                <!-- <Button label="저장" :fluid="false" @click="saveButton"></Button> -->
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
                            <Button label="저장" icon="pi pi-save" @click="saveBMenuButton" />
                        </div>
                    </section>

                    <hr />

                    <!-- 🔸 소메뉴 입력 구역 -->
                    <section class="flex flex-col gap-3">
                        <h3 class="text-base font-semibold text-gray-700">소메뉴 그룹</h3>

                        <Dropdown v-model="selecteBMenuModal" :options="leftGrid" optionLabel="bMenuName" placeholder="대메뉴를 선택하세요" class="w-full" filterPlaceholder="대메뉴명으로 검색" @change="changeBMenu" />

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
                        <Button label="저장" icon="pi pi-save" @click="saveSMenuButton" />
                    </div>
                </template>
            </Dialog>

            <!-- 하단: 좌/우 그리드 -->
            <div class="flex gap-4 w-full h-[720px]">
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

<style scoped>
button {
    margin-right: 10px;
    width: 100px;
    height: 50px;
}
</style>
