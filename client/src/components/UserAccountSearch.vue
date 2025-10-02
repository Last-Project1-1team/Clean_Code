<script setup>
import { ref } from 'vue';

// 부모에게 알림만 보냄
const emit = defineEmits(['search']);
const user_Id = ref('');
const name = ref('');
const department = ref('');
const work_grade = ref('');

const UserAccountSearch = () => {
    emit('search', {
        Id: user_Id.value,
        name: name.value,
        department: department.value,
        work_grade: work_grade.value
    });
};
</script>
<template>
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
                <Button label="조회" icon="pi pi-search" @click="UserAccountSearch"></Button>
            </div>
        </template>
    </Toolbar>
</template>
