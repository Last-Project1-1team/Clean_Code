<script setup>
import { ref, onMounted } from 'vue';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import axios from 'axios';

// 부모에게 알림만 보냄
const emit = defineEmits(['search']);
const userId = ref('');
const name = ref('');

//입력값
const department = ref([]);
const workGrade = ref([]);

// === AutoComplete 관련 ===
const departmentSuggestions = ref([]);
const gradeSuggestions = ref([]);

// //부서 자동완성 (예시)
// const searchDepartment = (event) => {
//     const query = event.query.toLowerCase();
//     const departments = ['총무부', '인사부', '영업부', '생산부', '품질부'];
//     departmentSuggestions.value = departments
//         .filter( c=> c.toLowerCase().includes(query))
//         .map((c) => ({ name: c }))
// };

// // 직급 자동완성 (예시)
// const searchWorkGrade = (event) => {
//     const query = event.query.toLowerCase();
//     const grades = ['사원', '주임', '대리', '과장', '차장', '부장'];
//     gradeSuggestions.value = grades
//         .filter(g => g.toLowerCase().includes(query))
//         .map(g => ({ name: g }))
// };

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
    const response = await axios.get(`${apiUrl}/userAccount/department`);
    flagDropdown.value = response.data.map((department) => ({
        label: department.name, // 보여줄 이름
        value: department.code // 실제 값
    }));
});
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const flagDropdown = ref([]);
const userAccount = ref([]);
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

                <label for="department" class="grid grid-cols-2 flex items-center">부서</label>
                <div class="col-span-3">
                    <InputText v-model="department" id="department" type="text" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <label for="workGrade" class="grid grid-cols-2 flex items-center">직급</label>
                <div class="col-span-3">
                    <InputText v-model="workGrade" id="workGrade" type="text" class="w-full" />
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
