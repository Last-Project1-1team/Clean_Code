<script setup>
import { ref } from 'vue';
import ModelMasterSearch from '@/components/ModelMasterSearch.vue';
</script>

<template>
    <div class="card">
        <ModelMasterSearch />

        <Splitter style="height: 580px" class="mb-8">
            <SplitterPanel :size="30" :minSize="10">
                <div className="h-full flex items-center justify-center">Panel 1</div>
            </SplitterPanel>
            <SplitterPanel :size="70">
                <Splitter layout="vertical">
                    <SplitterPanel :size="15">
                        <div className="h-full flex items-center justify-center">Panel 2</div>
                    </SplitterPanel>
                    <SplitterPanel :size="50">
                        <div className="h-full flex items-center justify-center">Panel 3</div>
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
        </Splitter>
    </div>
</template>
