<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const toast = useToast();
const selectedRow = ref(null);

//왼쪽그리드 결과 담을 배열
const leftGrid = ref([]);

//오른쪽그리드 결과 담을 배열
const rightGrid = ref([]);

//대메뉴(왼쪽그리드) 목록
const formData1 = ref({
    bmenuCode: '',
    bmenuName: ''
});

//전체조회
const getTotalList = async (bmenuCode) => {
    let result = await axios
        .get(`${apiUrl}/totalMenu?`, {
            params: {
                bmenuCode: bmenuCode || ''
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
        formData1.value = { ...firstRow };
    } else {
        selectedRow.value = null;
        selectedRow.value = { groupCode: '', groupName: '', groupExp: '' }; // 결과 없을 때 선택 해제
    }
};

//저장(등록)
const saveButton = async () => {
    const payload = {
        bmenuCode: formData1.value.bmenuCode,
        bmenuName: formData1.value.bmenuName
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
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-3">
                    <Select class="w-full" v-model="selectedGroup" :options="groupDropdown" optionLabel="label" optionValue="value" placeholder="코드그룹선택" @change="getGroupList(selectedGroup)" />
                </div>
            </div>
            <div class="col-span-4">
                <Button label="신규" :fluid="false" @click="groupSearch"></Button>
                <Button label="저장" :fluid="false" @click="saveButton"></Button>
            </div>
            <!-- 하단: 좌/우 그리드 -->
            <div class="flex gap-4 w-full h-[620px]">
                <!-- 왼쪽 그리드 -->
                <div class="flex-1 border rounded p-2 overflow-auto">
                    <DataTable :value="leftGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="formData = { ...$event.data }" dataKey="codeGroup">
                        <Column field="groupCode" header="대그룹코드"></Column>
                        <Column field="groupName" header="대메뉴명"></Column>
                    </DataTable>
                </div>

                <!-- 오른쪽 그리드 -->
                <div class="flex-1 border rounded p-2 overflow-auto">
                    <DataTable :value="rightGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="formData = { ...$event.data }" dataKey="codeGroup">
                        <Column field="groupCode" header="소메뉴코드"></Column>
                        <Column field="groupName" header="소메뉴명"></Column>
                        <Column field="groupExp" header="프로그램명"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>
