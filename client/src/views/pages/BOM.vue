<script setup>
import { ref } from 'vue';
import ModelMasterSearch from '@/components/ModelMasterSearch.vue';
</script>

<template>
    <div class="card">
        <ModelMasterSearch />

        <TreeTable :value="treeTableValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeTableValue" style="height: 65vh; border: 1px solid #ddd">
            <Column field="name" header="level" :expander="true"></Column>
            <Column field="size" header="품번"></Column>
            <Column field="type" header="품명"></Column>
            <Column field="type" header="규격"></Column>
            <Column field="type" header="수량"></Column>
            <Column field="type" header="단위"></Column>
        </TreeTable>
    </div>
</template>
