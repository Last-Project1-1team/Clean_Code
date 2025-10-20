<script setup>
import { ref, onMounted } from 'vue';
import UserAccountSearch from '@/components/UserAccountSearch.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter(); // root 컴포넌트에 등록된 라우터를 불러오는 함수
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const selectAccount = ref(null);
const userAccount = ref([]);
const selectedAccount = ref(null);
const selectedUnit = ref(null);
const radioValue = ref(null);
const toast = useToast();

const departmentOptions = ref([]);
const workGradeOptions = ref([]);

// 날짜 선택용
const hireDate = ref(null);
const retireDate = ref(null);

//그리드에 나올목록
const formData = ref({
    userId: '',
    password: '',
    name: '',
    workGrade: '',
    department: '',
    phone: '',
    email: '',
    hireDate: '',
    retireYn: '',
    retireDate: ''
});

//초기화버튼
const onClearItem = () => {
    formData.value = {
        userId: '',
        password: '',
        name: '',
        workGrade: '',
        department: '',
        phone: '',
        email: '',
        hireDate: '',
        retireYn: '',
        retireDate: ''
    };
    selectedAccount.value = null;
    selectedUnit.value = null;
    radioValue.value = null;
    hireDate.value = null;
    retireDate.value = null;
};

// 자식에서 조회버튼 눌렀을 때 받는 함수
const userAccountSearch = (account) => {
    console.log('📩 부모: 자식이 보낸 검색값', account);
    getAccountList(account.userId, account.name, account.department, account.workGrade, account.phone, account.email, account.hireDate, account.retireYn, account.retireDate);
};

// ✅ 조회 함수
const getAccountList = async (userId, name, department, workGrade, phone, email, hireDate, retireYn, retireDate) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/useraccount?`, {
            params: {
                userId: userId || '',
                name: name || '',
                workGrade: workGrade || '',
                department: department || '',
                phone: phone || '',
                email: email || '',
                hireDate: hireDate || '',
                retireYn: retireYn || '',
                retireDate: retireDate || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            userAccount.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    userAccount.value = result.data;
};

//셀렉트박스
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

//저장버튼
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};
const saveButton = async () => {
    const payload = {
        userId: formData.value.userId,
        name: formData.value.name,
        workGrade: formData.value.workGrade,
        department: formData.value.department,
        phone: formData.value.phone,
        email: formData.value.email,
        hireDate: formatDate(formData.value.hireDate),
        retireYn: formData.value.retireYn,
        retireDate: formatDate(formData.value.retireDate)
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/useraccount`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    if (formData.value.retireDate && formData.value.retireYn === 'N') {
        toast.add({
            severity: 'warn',
            summary: '저장 불가',
            detail: '퇴사일자가 선택되어 있으면 퇴사여부는 Y로 설정해야 합니다.',
            life: 3000
        });
        return; // 저장 중단
    }
    getAccountList();
};
</script>

<template>
    <div class="card flex flex-col gap-6">
        <!-- 조회부분 -->
        <UserAccountSearch @search="userAccountSearch" />

        <!--정보테이블-->
        <DataTable :value="userAccount" v-model:selection="selectAccount" selectionMode="single" @rowSelect="formData = { ...$event.data }" class="w-full" stripedRows responsiveLayout="scroll" style="height: 40vh; border: 1px solid #ddd">
            <Column field="userId" header="계정" />
            <Column field="name" header="이름" />
            <Column field="workGradeName" header="직급" />
            <Column field="deptName" header="부서" />
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
                <InputText id="name" type="text" class="w-full" v-model="formData.name" />
            </div>

            <div class="col-span-1"></div>

            <label for="phone" class="flex items-center col-span-1 mb-2">전화번호</label>
            <div class="col-span-3">
                <InputText id="phone" type="text" class="w-full" v-model="formData.phone" />
            </div>
            <div class="col-span-3 flex justify-end items-center gap-2">
                <Button label="초기화" :fluid="false" @click="onClearItem"></Button>
                <Button label="저장" :fluid="false" @click="saveButton"></Button>
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="userId" class="flex items-center col-span-1 mb-2">계정</label>
            <div class="col-span-3">
                <InputText id="userId" type="text" class="w-full" v-model="formData.userId" />
            </div>

            <div class="col-span-1"></div>

            <label for="email" class="flex items-center col-span-1 mb-2">이메일</label>
            <div class="col-span-3">
                <InputText id="email" type="text" class="w-full" v-model="formData.email" />
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="workGrade" class="flex items-center col-span-1 mb-2">직급</label>
            <div class="col-span-3">
                <Select class="w-full" v-model="formData.workGrade" :options="workGradeOptions" optionLabel="label" optionValue="value" />
            </div>

            <div class="col-span-1"></div>

            <label for="hireDate" class="flex items-center col-span-1 mb-2">입사일자</label>
            <div class="col-span-3">
                <DatePicker class="w-full" :showIcon="true" :showButtonBar="true" v-model="formData.hireDate" dateFormat="yy-mm-dd"></DatePicker>
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="department" class="flex items-center col-span-1 mb-2">부서</label>
            <div class="col-span-3">
                <Select class="w-full" v-model="formData.department" :options="departmentOptions" optionLabel="label" optionValue="value" />
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

            <label for="retireDate" class="flex items-center col-span-1 mb-2">퇴사일자</label>
            <div class="col-span-3">
                <DatePicker class="w-full" :showIcon="true" :showButtonBar="true" v-model="formData.retireDate" dateFormat="yy-mm-dd"></DatePicker>
            </div>
        </div>
    </div>
</template>
<style scoped>
.mb-6 {
    padding: 15px;
}
</style>
