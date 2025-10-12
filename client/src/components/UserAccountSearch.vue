<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 부모에게 알림만 보냄
const emit = defineEmits(['search']);
const userId = ref('');
const name = ref('');

//입력값
const department = ref([]);
const workGrade = ref([]);

const departmentOptions = ref([]);
const workGradeOptions = ref([]);
// const userAccount = ref([]);

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 조회 버튼 클릭 시 부모 컴포넌트에 검색 조건 전달
const userAccountSearch = () => {
    emit('search', {
        userId: userId.value,
        name: name.value,
        department: department.value,
        workGrade: workGrade.value
    });
};

onMounted(async () => {
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
});
</script>

<template>
    <Toolbar class="mb-6">
        <template #start>
            <!--단락 start-->
            <div class="grid grid-cols-12 gap-2">
                <label for="userId" class="grid grid-cols-2 flex items-center">계정</label>
                <div class="col-span-3">
                    <InputText v-model="userId" id="userId" type="text" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <label for="name" class="grid grid-cols-2 flex items-center">이름</label>
                <div class="col-span-3">
                    <InputText v-model="name" id="name" type="text" class="w-full" />
                </div>
                <!--단락 end-->

                <div class="col-span-3"></div>

                <!--단락 start-->
                <label for="workGrade" class="grid grid-cols-2 flex items-center">직급</label>
                <div class="col-span-3">
                    <Select class="w-full" v-model="workGrade" :options="workGradeOptions" optionLabel="label" optionValue="value" />
                </div>

                <div class="col-span-1"></div>

                <label for="department" class="grid grid-cols-2 flex items-center">부서</label>
                <div class="col-span-3">
                    <Select class="w-full" v-model="department" :options="departmentOptions" optionLabel="label" optionValue="value" />
                </div>
            </div>
            <!--단락 end-->
        </template>
        <!-- 조회버튼 -->
        <template #end>
            <div class="col-span-12 flex justify-end">
                <Button label="조회" icon="pi pi-search" @click="userAccountSearch"></Button>
            </div>
        </template>
    </Toolbar>
</template>
