<script></script>
<template>
    <div class="card flex flex-col gap-6">
        <!-- 조회부분 -->
        <Toolbar class="mb-6">
            <template #start>
                <!--단락 start-->
                <div class="grid grid-cols-12 gap-2">
                    <label for="account" class="grid grid-cols-2 flex items-center">계정</label>
                    <div class="col-span-3">
                        <InputText id="account" type="text" class="w-full" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="name" class="grid grid-cols-2 flex items-center">이름</label>
                    <div class="col-span-3">
                        <InputText id="name" type="text" class="w-full" />
                    </div>
                    <!--단락 end-->

                    <div class="col-span-3"></div>

                    <!--단락 start-->

                    <label for="account" class="grid grid-cols-2 flex items-center">부서</label>
                    <div class="col-span-3">
                        <AutoComplete v-model="selectedDepartment" :suggestions="autoFilteredDepartment" optionLabel="name" dropdown multiple display="chip" class="w-full" @complete="searchDepartment($event)" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="name" class="grid grid-cols-2 flex items-center">직급</label>
                    <div class="col-span-3">
                        <AutoComplete v-model="selectedDepartment" :suggestions="autoFilteredDepartment" optionLabel="name" dropdown multiple display="chip" class="w-full" @complete="searchDepartment($event)" />
                    </div>
                </div>
                <!--단락 end-->
            </template>
            <!-- 조회버튼 -->
            <template #end>
                <div class="col-span-12 flex justify-end">
                    <Button label="조회" icon="pi pi-search" @click="modelSearch"></Button>
                </div>
            </template>
        </Toolbar>

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
