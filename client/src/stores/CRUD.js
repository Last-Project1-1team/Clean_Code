// stores/inord.js (Composition/Setup 방식)
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useInordStore = defineStore('inord', () => {
    // composition API 방식 (예시)
    // state
    const list = ref([]);
    const loading = ref(false);
    const err = ref(null);

    // getter
    const totalQty = computed(() => list.value.reduce((s, r) => s + Number(r.INORD_QTY || 0), 0));

    // actions (그냥 함수 반환)
    async function fetchList(params = {}) {
        loading.value = true;
        err.value = null;
        try {
            const { data } = await axios.get('/api/inord/list', { params });
            list.value = Array.isArray(data) ? data : [];
        } catch (e) {
            err.value = e;
        } finally {
            loading.value = false;
        }
    }

    async function saveInord(payload) {
        const { data } = await axios.post('/api/inord', payload);
        return data;
    }

    function $reset() {
        list.value = [];
        loading.value = false;
        err.value = null;
    }

    return { list, loading, err, totalQty, fetchList, saveInord, $reset };
});
