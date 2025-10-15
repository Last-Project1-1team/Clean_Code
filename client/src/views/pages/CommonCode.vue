<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const selectedRow = ref(null);
const apiUrl = import.meta.env.VITE_API_BASE_URL;

//조회 결과 담을 배열
const leftGrid = ref([]);
//드롭다운 선택값
const selectedCommon = ref(null);
//공통코드 드롭다운
const commonDropdown = ref([]);
// 코드그룹 목록
const formData = ref({
    commonCode: '',
    groupCode: '',
    codeName: ''
});
const commonCode = ref([]);
//초기화버튼
const onClearItem = () => {
    formData.value = {
        groupCode: '',
        codeName: ''
    };
};
//==공통코드 그룹 조회 ==
onMounted(async () => {
    const response = await axios.get(`${apiUrl}/commonCode/common`);
    commonDropdown.value = response.data.map((common) => ({
        label: common.name, // 보여줄 이름
        value: common.code // 실제 값
    }));
});

const commonSearch = () => {
    if (!selectedCommon.value) {
        toast.add({ severity: 'warn', summary: '코드그룹을 선택하세요.', life: 2000 });
        return;
    }
    console.log('선택된 그룹:', selectedCommon.value);
    getCommonList(selectedCommon.value);
};

//전체조회
const getCommonList = async (codeGroup) => {
    let result = await axios
        .get(`${apiUrl}/commonCode?`, {
            params: {
                codeGroup: codeGroup || ''
            }
        })
        .catch((err) => {
            console.error('코드 조회 실패:', err);
            leftGrid.value = result.data;
        });
    leftGrid.value = result.data;

    // ✅ 첫 번째 행만 자동선택 (formData 채우지 않음)
    if (result.data && result.data.length > 0) {
        selectedRow.value = result.data[0]; // 왼쪽 테이블 첫 행 자동 선택
    } else {
        selectedRow.value = null; // 결과 없을 때 선택 해제
    }
};

//저장(등록)
const saveButton = async () => {
    const payload = {
        commonCode: formData.value.commonCode,
        groupCode: formData.value.groupCode,
        codeName: formData.value.codeName
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/commonCode/insert`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    getCommonList(selectedCommon.value);
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <div class="grid grid-cols-12 gap-2">
                <label for="proc" class="grid grid-cols-2 flex items-center">코드그룹</label>
                <div class="col-span-3">
                    <Select class="w-full" v-model="selectedCommon" :options="commonDropdown" optionLabel="label" optionValue="value" placeholder="코드그룹선택" @change="getCommonList(selectedCommon)" />
                </div>
            </div>

            <div class="flex gap-2">
                <Button label="초기화" :fluid="false" @click="onClearItem"></Button>
                <Button label="저장" :fluid="false" @click="saveButton"></Button>
                <Button label="조회" :fluid="false" @click="commonSearch"></Button>
            </div>
        </div>
        <!-- 하단: 좌/우 그리드 -->
        <div class="flex gap-4 w-full h-[620px]">
            <!-- 왼쪽 그리드 -->
            <div class="flex-1 border rounded p-2 overflow-auto">
                <DataTable :value="leftGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="formData = { ...$event.data }" dataKey="commonCode">
                    <Column field="groupCode" header="코드그룹"></Column>
                    <Column field="commonCode" header="코드ID"></Column>
                    <Column field="codeName" header="코드명"></Column>
                </DataTable>
            </div>

            <!-- 오른쪽 그리드 -->
            <div class="flex-1 border rounded p-4 overflow-auto">
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-12 gap-4">
                        <label for="groupCode" class="flex items-center col-span-2">코드그룹</label>
                        <div class="col-span-10">
                            <InputText v-model="formData.groupCode" type="text" class="w-full" readonly="true" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="commonCode" class="flex items-center col-span-2">코드ID</label>
                        <div class="col-span-10">
                            <InputText v-model="formData.commonCode" type="text" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="codename" class="flex items-center col-span-2">코드명</label>
                        <div class="col-span-10">
                            <InputText v-model="formData.codeName" type="text" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
