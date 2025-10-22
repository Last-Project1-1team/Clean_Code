<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ModelMasterSearch from '@/components/ModelMasterSearch.vue';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const leftGrid = ref([]);
const upRightGrid = ref([]);
const downRightGrid = ref([]);

//제품정보조회
const modelSearch = (model) => {
    //console.log('📩 부모: 자식이 보낸 검색값', model);
    getModelList(model.code, model.revision, model.name);
};

const getModelList = async (code, revision, name) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/modelmaster?`, {
            params: {
                modelCode: code || '',
                revision: revision || '',
                modelName: name || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            leftGrid.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    leftGrid.value = result.data;
};

//공정정보조회
const procRoutingSearch = (proc) => {
    //console.log('📩 부모: 자식이 보낸 검색값', model);
    getProcList(proc.procSeq, proc.procCode, proc.codeName);
};

const getProcList = async (procSeq, procCode, codeName) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/procRouting?`, {
            params: {
                procSeq: procSeq || '',
                procCode: procCode || '',
                codeName: codeName || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            upRightGrid.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    upRightGrid.value = result.data;
};

//
const procRoutingSearch2 = (proc2) => {
    //console.log('📩 부모: 자식이 보낸 검색값', model);
    getProcList2(proc2.procSeq, proc2.procCode, proc2.codeName);
};

const getProcList2 = async (procCode, codeName) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/procRouting?`, {
            params: {
                procCode: procCode || '',
                codeName: codeName || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            downRightGrid.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    downRightGrid.value = result.data;
};
</script>
<template>
    <ModelMasterSearch @search="modelSearch" />
    <div class="flex gap-4 w-full h-[700px]">
        <!-- 왼쪽 그리드 -->
        <div class="flex-1 border rounded p-2 overflow-auto">
            <DataTable :value="leftGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" @rowSelect="onBMenuSelect" dataKey="bMenuCode" style="height: 38vh">
                <Column field="modelCode" header="제품코드"></Column>
                <Column field="modelName" header="제품명"></Column>
                <Column field="revision" header="리비전"></Column>
                <Column field="modelFlag" header="완반제품"></Column>
            </DataTable>
        </div>

        <procRoutingSearch @search="procRoutingSearch" />
        <!-- 오른쪽 그리드 -->
        <div class="flex-1 border rounded p-2 overflow-auto">
            <DataTable :value="upRightGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" dataKey="sMenuCode" style="height: 38vh">
                <Column field="check" header="선택"></Column>
                <Column field="procSeq" header="순번"></Column>
                <Column field="procCode" header="공정코드"></Column>
                <Column field="procName" header="공정명"></Column>
            </DataTable>

            <!-- 🔹 화살표 버튼: 가로(좌우) 배치 -->
            <div class="flex justify-center items-center gap-4 my-2">
                <div class="arrow-btn" @click="moveUp">▲</div>
                <div class="arrow-btn" @click="moveDown">▼</div>
            </div>

            <procRoutingSearch2 @search="procRoutingSearch2" />
            <DataTable :value="downRightGrid" v-model:selection="selectedRow" selectionMode="single" class="w-full" dataKey="" style="height: 38vh">
                <Column field="check" header="선택"></Column>
                <Column field="procCode" header="공정코드"></Column>
                <Column field="procName" header="공정명"></Column>
            </DataTable>
        </div>
    </div>
</template>
<style scoped>
.arrow-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 4px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.arrow-btn:hover {
    background-color: #e0e0e0;
}
</style>
