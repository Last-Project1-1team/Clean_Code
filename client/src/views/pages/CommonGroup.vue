<script setup>
import {} from 'vue';
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="flex flex-wrap items-start gap-4 justify-between w-full">
            <div class="field flex items-center gap-10">
                <span class="font-semibold text-xl"> 코드그룹</span>
                <AutoComplete v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown multiple display="chip" class="w-[600px]" @complete="searchCountry($event)" />
            </div>
            <div class="flex gap-2">
                <Button label="저장" :fluid="false"></Button>
                <Button label="조회" :fluid="false"></Button>
            </div>
        </div>
        <!-- 하단: 좌/우 그리드 -->
        <div class="flex gap-4 w-full h-[620px]">
            <!-- 왼쪽 그리드 -->
            <div class="flex-1 border rounded p-2 overflow-auto">
                <DataTable :value="leftData" class="w-full">
                    <Column field="groupID" header="그룹ID"></Column>
                    <Column field="groupname" header="그룹명"></Column>
                    <Column field="explanation" header="그룹설명"></Column>
                </DataTable>
            </div>

            <!-- 오른쪽 그리드 -->
            <div class="flex-1 border rounded p-4 overflow-auto">
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-12 gap-4">
                        <label for="groupID" class="flex items-center col-span-2">그룹ID</label>
                        <div class="col-span-10">
                            <InputText id="groupID" type="text" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="groupname" class="flex items-center col-span-2">그룹명</label>
                        <div class="col-span-10">
                            <InputText id="groupname" type="text" class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <label for="explanation" class="flex items-center col-span-2">그룹설명</label>
                        <div class="col-span-10">
                            <Textarea placeholder="" :autoResize="true" rows="3" cols="69" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
