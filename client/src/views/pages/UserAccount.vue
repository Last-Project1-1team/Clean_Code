<script>
import { ref, onMounted } from 'vue';
import UserAccountSearch from '@/components/UserAccountSearch.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter(); // root 컴포넌트에 등록된 라우터를 불러오는 함수
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 컴포넌트가 마운트될 때 options 데이터 로드
onMounted(async () => {
    const response = await axios.get(`${apiUrl}/userAccount/modelFlag`);
    flagDropdown.value = response.data.map((model) => ({
        label: model.name, // 보여줄 이름
        value: model.code // 실제 값
    }));
});
//const userAccount = ref([]);
const formData = ref({
    user_id: '',
    name: '',
    work_grade: '',
    department: '',
    phone: '',
    email: '',
    hireDate: '',
    retireYN: '',
    retireDate: ''
});

// 초기화 버튼
function onClearUser() {
    console.log('초기화버튼클릭됨');
    formData.value = {
        user_id: '',
        name: '',
        work_grade: '',
        department: '',
        phone: '',
        email: '',
        hireDate: '',
        retireYN: '',
        retireDate: ''
    };
}

//const radioValue = ref(null);
const userAccount = ref([
    // { user_id: 'P00001', password: '1234', name: '홍길동', work_grade: '과장', department: '영업', phone: '010-1234-4567', email: 'aaa1111@yadam.com', hireDate: '2017-12-12', retireYN: 'N', retireDate: '' },
    // { user_id: 'P00002', password: '1212', name: '김민수', work_grade: '부장', department: '생산', phone: '010-2222-3333', email: 'bbb2222@yadam.com', hireDate: '2020-11-01', retireYN: 'Y', retireDate: '2022-01-31' },
    // { user_id: 'P00003', password: '1111', name: '이지민', work_grade: '사원', department: '자재', phone: '010-5555-1212', email: 'ccc3333@yadam.com', hireDate: '2019-01-20', retireYN: 'Y', retireDate: '2025-07-31' },
    // { user_id: 'P00004', password: '0000', name: '박수진', work_grade: '주임', department: '품질', phone: '010-7895-2323', email: 'ddd4444@yadam.com', hireDate: '2022-03-01', retireYN: 'N', retireDate: '' }
]);
</script>
<template>
    <div class="card flex flex-col gap-6">
        <!-- 조회부분 -->
        <UserAccountSearch @search="accountSearch" />

        <!--정보테이블-->
        <DataTable :value="users" class="w-full" stripedRows responsiveLayout="scroll" style="height: 40vh; border: 1px solid #ddd">
            <Column field="name" header="이름" />
            <Column field="account" header="계정" />
            <Column field="position" header="직급" />
            <Column field="department" header="부서" />
            <Column field="phone" header="전화번호" />
            <Column field="email" header="이메일" />
            <Column field="hireDate" header="입사일자" />
            <Column field="resignYN" header="퇴사여부" />
            <Column field="resignDate" header="퇴사일자" />
        </DataTable>

        <!--등록화면 -->
        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="account" class="flex items-center col-span-1 mb-2">이름</label>
            <div class="col-span-3">
                <InputText id="account" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="name" class="flex items-center col-span-1 mb-2">전화번호</label>
            <div class="col-span-3">
                <InputText id="name" type="text" class="w-full" />
            </div>
            <div class="col-span-3 flex justify-end items-center gap-2">
                <Button label="비밀번호초기화" :fluid="false"></Button>
                <Button label="초기화" :fluid="false"></Button>
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

            <label for="name" class="flex items-center col-span-1 mb-2">이메일</label>
            <div class="col-span-3">
                <InputText id="name" type="text" class="w-full" />
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="account" class="flex items-center col-span-1 mb-2">직급</label>
            <div class="col-span-3">
                <InputText id="account" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="name" class="flex items-center col-span-1 mb-2">입사일자</label>
            <div class="col-span-3">
                <InputText id="name" type="text" class="w-full" />
            </div>
        </div>
        <!--단락 end-->

        <!--단락 start-->
        <div class="grid grid-cols-12 gap-2">
            <label for="account" class="flex items-center col-span-1 mb-2">부서</label>
            <div class="col-span-3">
                <InputText id="account" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <!--단락 end-->
        </div>
    </div>
</template>
<style scoped>
.mb-6 {
    padding: 15px;
}
</style>
