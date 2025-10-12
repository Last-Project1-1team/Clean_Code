<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="selectProc" class="flex items-center col-span-1 mb-2 md:mb-0">공정선택</label>
                    <div class="col-span-2">
                        <Select id="selectProc" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="공정선택" class="w-full" />
                    </div>

                    <label for="startPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획시작일</label>
                    <div class="col-span-2">
                        <DatePicker id="startPlan" :showIcon="true" :showButtonBar="true" v-model="startPlanDate" date-format="yy-mm-dd"></DatePicker>
                    </div>

                    <label for="endPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker class="col-span-2" id="endPlan" :showIcon="true" :showButtonBar="true" v-model="endPlanDate" date-format="yy-mm-dd"></DatePicker>
                    </div>
                    <div class="col-span-3"></div>
                    <label for="modelCode" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
                    <div class="col-span-2">
                        <AutoComplete id="modelCode" class="w-full" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown display="chip" @complete="searchCountry($event)" />
                    </div>

                    <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-2">
                        <Select class="w-full" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
                    </div>
                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
                    <div class="col-span-2">
                        <InputText v-model="modelName" id="modelName" type="text" class="w-full" />
                    </div>
                </div>
            </template>
            <template #end>
                <Button label="조회" @click="modelSearch"></Button>
                <Button label="조회" @click="modelSearch"></Button>
            </template>
        </Toolbar>

        <DataTable :value="modelMaster" v-model:selection="selectedModel" selectionMode="single" datakey="modelCode" scrollable scrollHeight="400px" class="mt-6" style="height: 70vh; border: 1px solid #ddd" @rowSelect="formData = { ...$event.data }">
            <Column field="modelCode" header="계획등록일" style="min-width: 150px"></Column>
            <Column field="modelName" header="계획시작일" style="min-width: 150px"></Column>
            <Column field="revision" header="계획종료일" style="min-width: 150px"></Column>
            <Column field="modelFlagName" header="제품코드" style="min-width: 150px"></Column>
            <Column field="lotPQty" header="제품명" style="min-width: 200px"></Column>
            <Column field="spec" header="공정" style="min-width: 100px"></Column>
            <Column field="width" header="계획수량" style="min-width: 100px"></Column>
            <Column field="height" header="단위" style="min-width: 100px"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const startPlanDate = ref(new Date());
</script>

<style scoped>
.card {
    padding: 0px;
}
</style>
