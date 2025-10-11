<script setup>
import { ref, onMounted } from 'vue';
import UserAccountSearch from '@/components/UserAccountSearch.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter(); // root 컴포넌트에 등록된 라우터를 불러오는 함수
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const selectAccount = ref(null);
const userAccount = ref([]);

// 자동완성용 더미 (일단은 빈 배열로)
const autoFilteredDepartment = ref([]);
const autoFilteredWorkGrade = ref([]);

const formData = ref({
    userId: '',
    name: '',
    workGrade: '',
    department: '',
    phone: '',
    email: '',
    hireDate: '',
    retireYn: '',
    retireDate: ''
});

//컴포넌트가 마운트될 때 options 데이터 로드
onMounted(async () => {
    try {
        const response = await axios.get(`${apiUrl}/useraccount/userInfo`);
        userAccount.value = response.data; // map 안 씀!
    } catch (err) {
        console.error('초기 데이터 로드 실패:', err);
    }
});

// 초기화 버튼
function onClearUser() {
    console.log('초기화버튼클릭됨');
    formData.value = {
        userId: '',
        name: '',
        workGrade: '',
        department: '',
        phone: '',
        email: '',
        hireDate: '',
        retireYn: '',
        retireDate: ''
    };
}

const userAccountSearch = (account) => {
    console.log('📩 부모: 자식이 보낸 검색값', account);
    getAccountList(account.userId, account.name, account.department, account.workGrade);
};

// const getAccountList = async (userId, name, department, workGrade) => {
//     try {
//         const result = await axios.get(`${apiUrl}/useraccount?`, {
//             params: {
//                 userId: userId || '',
//                 name: name || '',
//                 department: department || '',
//                 workGrade: workGrade || ''
//             }
//         });
//         userAccount.value = result.data;
//     } catch (err) {
//         console.error('조회 실패:', err);
//     }
// };

// ✅ 서버 조회 함수
const getAccountList = async (userId, name, department, workGrade) => {
    try {
        const result = await axios.get(`${apiUrl}/useraccount`, {
            params: { userId, name, department, workGrade }
        });
        userAccount.value = result.data;
        console.log('✅ 서버 응답:', result.data);
    } catch (err) {
        console.error('❌ 조회 실패:', err);
    }
};
</script>

<template>
    <div class="card flex flex-col gap-6">
        <!-- 조회부분 -->
        <UserAccountSearch @search="userAccountSearch" />

        <!--정보테이블-->
        <DataTable :value="userAccount" v-model:selection="selectAccount" @rowSelect="formData = { ...$event.data }" class="w-full" stripedRows responsiveLayout="scroll" style="height: 40vh; border: 1px solid #ddd">
            <Column field="userId" header="계정" />
            <Column field="name" header="이름" />
            <Column field="workGrade" header="직급" />
            <Column field="department" header="부서" />
            <Column field="phone" header="전화번호" />
            <Column field="email" header="이메일" />
            <Column field="hireDate" header="입사일자" />
            <Column field="retireYn" header="퇴사여부" />
            <Column field="retireDate" header="퇴사일자" />
        </DataTable>

        <!--등록화면 -->
        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="name" class="flex items-center col-span-1 mb-2">이름</label>
            <div class="col-span-3">
                <InputText id="name" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="phone" class="flex items-center col-span-1 mb-2">전화번호</label>
            <div class="col-span-3">
                <InputText id="phone" type="text" class="w-full" />
            </div>
            <div class="col-span-3 flex justify-end items-center gap-2">
                <Button label="비밀번호초기화" :fluid="false"></Button>
                <Button label="초기화" :fluid="false" v-on:click="onClearItem" />
                <Button label="조회" :fluid="false"></Button>
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="account" class="flex items-center col-span-1 mb-2">계정</label>
            <div class="col-span-3">
                <InputText id="account" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="email" class="flex items-center col-span-1 mb-2">이메일</label>
            <div class="col-span-3">
                <InputText id="email" type="text" class="w-full" />
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="workGrade" class="flex items-center col-span-1 mb-2">직급</label>
            <div class="col-span-3">
                <Select class="w-full" v-model="formData.workGrade" :options="flagDropdown" optionLabel="label" optionValue="value"/>
            </div>

            <div class="col-span-1"></div>

            <label for="hireDate" class="flex items-center col-span-1 mb-2">입사일자</label>
            <div class="col-span-3">
                <DatePicker class="w-full" :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="department" class="flex items-center col-span-1 mb-2">부서</label>
            <div class="col-span-3">
                <Select class="w-full" v-model="formData.department" :options="flagDropdown" optionLabel="label" optionValue="value"/>
            </div>

            <div class="col-span-1"></div>
        </div>

        <!--단락 end-->
        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="retireYn" class="flex items-center">퇴사여부</label>
            <div class="col-span-3">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <RadioButton id="retireYn" value="Y" v-model="formData.retireYn" />
                        <label for="retireYn" class="leading-none ml-2 col-3">Y</label>
                        <RadioButton id="retireYn" value="N" v-model="formData.retireYn" />
                        <label for="retireYn" class="leading-none ml-2">N</label>
                    </div>
                </div>
            </div>

            <div class="col-span-1"></div>

            <label for="hireDate" class="flex items-center col-span-1 mb-2">퇴사일자</label>
            <div class="col-span-3">
                <DatePicker class="w-full" :showIcon="true" :showButtonBar="true" v-model="calendarValue"></DatePicker>
            </div>
        </div>
    </div>
</template>
<style scoped>
.mb-6 {
    padding: 15px;
}
</style>
