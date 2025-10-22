<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const codeGroup = ref([]);
const toast = useToast();
const selectedRow = ref(null);
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const firstRow = ref(null);

//조회 결과 담을 배열
const leftGrid = ref([]);

//드롭다운 선택값
const selectedGroup = ref(null);

//공통코드 드롭다운
const groupDropdown = ref([]);

// 코드그룹 목록
const formData = ref({
    groupCode: '',
    groupName: '',
    groupExp: ''
});

//
const commonCode = ref([]);

//초기화버튼
const onClearItem = () => {
    formData.value = {
        groupCode: formData.value.groupCode,
        groupName: '',
        groupExp: ''
    };
};

//==코드그룹조회 ==
onMounted(async () => {
    const response = await axios.get(`${apiUrl}/codeGroup/groupId`);
    groupDropdown.value = response.data.map((group) => ({
        label: group.name, // 보여줄 이름
        value: group.code // 실제 값
    }));
});

const groupSearch = () => {
    if (!selectedGroup.value) {
        toast.add({ severity: 'warn', summary: '코드그룹을 선택하세요.', life: 2000 });
        return;
    }
    console.log('선택된 그룹:', selectedGroup.value);
    getGroupList(selectedGroup.value);
};

//전체조회
const getGroupList = async (groupCode) => {
    let result = await axios
        .get(`${apiUrl}/codeGroup?`, {
            params: {
                groupCode: groupCode || ''
            }
        })
        .catch((err) => {
            console.error('코드 조회 실패:', err);
            leftGrid.value = result.data;
        });
    leftGrid.value = result.data;

    // ✅ 첫 번째 행만 자동선택 (formData 채우지 않음)
    if (result.data && result.data.length > 0) {
        const firstRow = result.data[0];
        selectedRow.value = result.data[0]; // 왼쪽 테이블 첫 행 자동 선택
        formData.value = { ...firstRow };
    } else {
        selectedRow.value = null;
        selectedRow.value = { groupCode: '', groupName: '', groupExp: '' }; // 결과 없을 때 선택 해제
    }
};

//저장(등록)
const saveButton = async () => {
    // 입력값 검증
    if (!formData.value.groupCode?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '그룹ID를 입력하세요', life: 3000 });
        return;
    }
    if (!formData.value.groupName?.trim()) {
        toast.add({ severity: 'warn', summary: '입력 오류', detail: '그룹명을 입력하세요', life: 3000 });
        return;
    }

    // 중복 체크
    // const isDuplicate = leftGrid.value.some((item) => item.groupCode === formData.value.groupCode);
    // if (isDuplicate) {
    //     toast.add({ severity: 'warn', summary: '중복 오류', detail: '이미 존재하는 그룹ID입니다', life: 3000 });
    //     return;
    // }
    const payload = {
        groupCode: formData.value.groupCode,
        groupName: formData.value.groupName,
        groupExp: formData.value.groupExp
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/codeGroup/insert`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    getGroupList(selectedGroup.value);
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <div class="grid grid-cols-6 gap-2">
                <label for="codeGroup" class="grid grid-cols-2 flex items-center">코드그룹</label>
                <div class="col-span-3">
                    <Select class="w-full" v-model="selectedGroup" :options="groupDropdown" optionLabel="label" optionValue="value" placeholder="코드그룹선택" @change="getGroupList(selectedGroup)" />
                </div>
            </div>
            <div class="col-span-4">
                <Button label="초기화" :fluid="false" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="onClearItem"></Button>
                <div class="inline-flex items-center"></div>
                <Button label="저장" :fluid="false" class="p-button-success px-6 py-3 text-lg font-bold" @click="saveButton"></Button>
                <div class="inline-flex items-center"></div>
                <Button label="조회" :fluid="false" class="p-button-success px-6 py-3 text-lg font-bold" @click="groupSearch"></Button>
            </div>
            <!-- 하단: 좌/우 그리드 -->
            <div class="flex gap-4 w-full h-[720px]">
                <!-- 왼쪽 그리드 -->
                <div class="flex-1 border rounded p-2 overflow-auto">
                    <DataTable :value="leftGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="formData = { ...$event.data }" dataKey="codeGroup">
                        <Column field="groupCode" header="그룹ID"></Column>
                        <Column field="groupName" header="그룹명"></Column>
                        <Column field="groupExp" header="그룹설명"></Column>
                    </DataTable>
                </div>

                <!-- 오른쪽 그리드 -->
                <div class="flex-1 border rounded p-4 overflow-auto">
                    <div class="flex flex-col gap-4">
                        <div class="grid grid-cols-12 gap-4">
                            <label for="groupCode" class="flex items-center col-span-2">그룹ID</label>
                            <div class="col-span-10">
                                <InputText v-model="formData.groupCode" type="text" class="w-full" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                            <label for="groupName" class="flex items-center col-span-2">그룹명</label>
                            <div class="col-span-10">
                                <InputText v-model="formData.groupName" type="text" class="w-full" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-4">
                            <label for="groupExp" class="flex items-center col-span-2">그룹설명</label>
                            <div class="col-span-10">
                                <Textarea v-model="formData.groupExp" type="text" class="w-full" placeholder="" :autoResize="true" rows="3" cols="69" />
                            </div>
                        </div>
                    </div>
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
