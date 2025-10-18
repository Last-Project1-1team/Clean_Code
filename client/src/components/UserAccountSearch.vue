<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['search']);
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 각각의 입력값
const userId = ref('');
const name = ref('');
const department = ref('');
const workGrade = ref('');
const selectedAccount = ref(null);
const selectedUnit = ref(null);
const radioValue = ref(null);
const departmentOptions = ref([]);
const workGradeOptions = ref([]);
const hireDate = ref(null);
const phone = ref(null);
const email = ref('');
const formatDate = ref(null);
const retireYn = ref('');
const retireDate = ref(null);

// 부모로 검색조건 전달
const userAccountSearch = () => {
    emit('search', {
        userId: userId.value,
        name: name.value,
        department: department.value,
        workGrade: workGrade.value
    });
};

// ✅ 초기화 버튼 클릭 시 모든 입력값을 비움
const onClearItem = () => {
    userId.value = '';
    name.value = '';
    department.value = '';
    workGrade.value = '';
    selectedAccount.value = null;
    selectedUnit.value = null;
    radioValue.value = null;
    hireDate.value = null;
    retireDate.value = null;
};

// ✅ DB에서 부서, 직급 데이터 불러오기
onMounted(async () => {
    try {
        const deptRes = await axios.get(`${apiUrl}/useraccount/department`);
        departmentOptions.value = deptRes.data.map((dept) => ({
            label: dept.name,
            value: dept.code
        }));

        const gradeRes = await axios.get(`${apiUrl}/useraccount/workGrade`);
        workGradeOptions.value = gradeRes.data.map((grade) => ({
            label: grade.name,
            value: grade.code
        }));
    } catch (err) {
        console.error('부서/직급 데이터 로드 실패:', err);
    }
});
</script>

<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <!-- 계정 -->
                <label for="userId" class="flex items-center col-span-1">계정</label>
                <div class="col-span-3">
                    <InputText v-model="userId" id="userId" type="text" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <!-- 이름 -->
                <label for="name" class="flex items-center col-span-1">이름</label>
                <div class="col-span-3">
                    <InputText v-model="name" id="name" type="text" class="w-full" />
                </div>

                <div class="col-span-3"></div>

                <!-- 직급 -->
                <label for="workGrade" class="flex items-center col-span-1">직급</label>
                <div class="col-span-3">
                    <Select v-model="workGrade" :options="workGradeOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <!-- 부서 -->
                <label for="department" class="flex items-center col-span-1">부서</label>
                <div class="col-span-3">
                    <Select v-model="department" :options="departmentOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>
        </template>

        <template #end>
            <div class="flex justify-end gap-2">
                <Button label="초기화" severity="secondary" @click="onClearItem" />
                <Button label="조회" icon="pi pi-search" @click="userAccountSearch" />
            </div>
        </template>
    </Toolbar>
</template>
