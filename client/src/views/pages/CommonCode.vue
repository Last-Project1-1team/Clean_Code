<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/commonCode/common`);
    commonDropdown.value = response.data.map((common) => ({
        label: common.code, // 보여줄 이름
        value: common.name // 실제 값
    }));
});

const commonCode = ref([]);

//공통코드 드롭다운
const commonDropdown = ref([]);
// 왼쪽 테이블 데이터
const leftData = ref([]);
// 오른쪽 입력폼 데이터
const rightData = ref([]);
// 코드그룹 목록
const codeGroupOptions = ref([]);
const formData = ref({
    codeGroup: '',
    codeId: '',
    codeName: ''
});

// const searchProdPlan = () => {
//     if (selectedAutoValue.value && selectedAutoValue.value.prodPlanNo) {
//         getProdPlan(selectedAutoValue.value.prodPlanNo);
//     } else {
//         getProdPlan(); // 전체 조회용 fallback (선택 안 했을 때)
//     }
// };

//조회
const commonSearch = (common) => {
    console.log(common);
    getCommonList(common.codeGroup, common.codeId, common.codeName);
};

const getCommonList = async (codeGroup, codeId, codeName) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/commonCode?`, {
            params: {
                codeGroup: codeGroup || '',
                codeId: codeId || '',
                codeName: codeName || ''
            }
        })
        .catch((err) => {
            console.error('코드 조회 실패:', err);
            commonCode.value = result.data;
        });
    commonCode.value = result.data;
};

//저장
const saveButton = async () => {
    const payload = {
        codeGroup: formData.value.codeGroup,
        codeId: formData.value.codeId,
        codeName: formData.value.codeName
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/commonCode`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    getCommonList();
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <div class="grid grid-cols-12 gap-2">
                <label for="proc" class="grid grid-cols-2 flex items-center">코드그룹</label>
                <div class="col-span-3">
                    <Select class="w-full" v-model="commonDropdown" :options="commonDropdown" optionLabel="label" optionValue="value" placeholder="코드그룹선택" />
                </div>
            </div>

            <div class="flex gap-2">
                <Button label="저장" :fluid="false" @click="saveButton"></Button>
                <Button label="조회" :fluid="false" @click="getCommonList"></Button>
            </div>
        </div>
        <!-- 하단: 좌/우 그리드 -->
        <div class="flex gap-4 w-full h-[620px]">
            <!-- 왼쪽 그리드 -->
            <div class="flex-1 border rounded p-2 overflow-auto">
                <DataTable :value="leftData" class="w-full">
                    <Column field="group" header="코드그룹"></Column>
                    <Column field="id" header="코드ID"></Column>
                    <Column field="name" header="코드명"></Column>
                </DataTable>
            </div>

            <!-- 오른쪽 그리드 -->
            <div class="flex-1 border rounded p-4 overflow-auto">
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-12 gap-4">
                        <label for="codegroup" class="flex items-center col-span-2">코드그룹</label>
                        <div class="col-span-10">
                            <InputText id="codegroup" type="text" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="codeid" class="flex items-center col-span-2">코드ID</label>
                        <div class="col-span-10">
                            <InputText id="codeid" type="text" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="codename" class="flex items-center col-span-2">코드명</label>
                        <div class="col-span-10">
                            <InputText id="codename" type="text" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
