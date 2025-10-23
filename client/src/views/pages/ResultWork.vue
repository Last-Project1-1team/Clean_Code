<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';
import LotModal from '@/components/LotModal.vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();

// 날짜를 MySQL DATETIME 형식 문자열로 변환 (YYYY-MM-DD HH:MM:SS)
const formatDateForMySQL = (date) => {
    if (!date) return null;
    const pad = (num) => (num < 10 ? '0' + num : num);
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
};

const modelInfo = computed(() => {
    const d = selectedWorkOrder.value;
    return d && d.modelCode ? `${d.modelCode} / ${d.revision} / ${d.modelName}` : '';
});

// 입력한 실 작업수량
const realWorkQty = ref(null);

// --------------------------------------- 작업지시 관련 부분 ----------------------------------------
// 작업지시 모달 오픈 전 false 상태
const openWorkOrdModal = ref(false);
// 입력한 작업지시번호
const searchWorkOrdNo = ref('');
// 선택된 작업지시 정보
const selectedWorkOrder = ref({});
// DataTable에 보여질 데이터
const workOrd = ref([]);
// rowSelect 시 표시할 데이터
const formData = ref({});

// 아래 2개 변수 버튼쪽에 넘어와서 주석 처리해뒀는데 공부용으로 남겨둠
// 작업지시 모달에서 넘어온 작업공정을 받을 반응형 변수
// const receivedAllProcs = ref([]);
// 현재 진행 중인 공정의 인덱스
// const currentProcIndex = ref(0);

// 작업지시번호 모달창 OPEN
const openModalWithSearch = () => {
    // console.log('부모 검색 버튼 클릭:', searchWorkOrdNo.value);
    openWorkOrdModal.value = true;
};

// 모달 닫힐 때 입력값 초기화
watch(openWorkOrdModal, (newVal) => {
    if (!newVal) {
        searchWorkOrdNo.value = '';
    }
});

// 자식 컴포넌트에서 emit('workOrdreg', data)을 통해 이 함수가 호출됨
const onWorkOrderSelected = async (data) => {
    console.log('📢 부모 컴포넌트가 받은 데이터:', data);
    selectedWorkOrder.value = data; // 작업지시 전체 정보 저장
    bomList.value = data.bomList || []; // BOM 리스트 저장 (필요하다면)
    openWorkOrdModal.value = false; // 모달 닫기

    // 선택된 modelCode, revision 이용해 BOM 조회 실행
    if (data.modelCode && data.revision) {
        await fetchBomList(data.modelCode, data.revision, data.workOrdNo);
    }

    // 받은 allProcs 데이터를 가공하여 저장
    receivedAllProcs.value = (data.allProcs || []).map((proc) => ({
        // allProcs 배열의 각 요소가 { proc_code: 'P01', proc_name: '절단' } 이런 형태라고 가정
        // 사용자 데이터 구조에 맞게 `name` 또는 `code` 필드를 조정해줘!
        ...proc, // 원래 공정 데이터
        name: proc.proc_name || proc.proc_code || String(proc), // 화면 표시용 이름 (사용자 데이터에 맞춰 조정)
        proc_code: proc.proc_code || '', // 공정 코드 (실적 업데이트 시 사용)
        proc_seq: proc.proc_seq || 0, // 공정 순서 (있다면 사용)
        status: 'WAITING', // 초기 상태: 대기 중
        procStartTime: null, // 각 공정별 시작 시간
        procEndTime: null, // 각 공정별 종료 시간
        realWorkQty: 0 // 공정별 실적 수량
    }));

    // 새로운 작업지시가 오면 모든 상태를 초기화
    resetWorkOrderState();
    console.log('✨ 새로운 작업지시 데이터 수신, 공정 및 작업 상태 초기화!');
};

// 작업 상태 초기화 함수
// 전체 종료일 때만 완전 초기화
// 일시정지일 때는 현재 공정 인덱스와 상태 유지
const resetWorkOrderState = (isPause = false) => {
    if (isPause) {
        // 일시정지: 상태만 변경하고 진행 중인 공정은 유지
        isWorkOrderRunning.value = false;
        workOrderPaused.value = true; // 재개 가능 상태로 전환
        workOrderEndTime.value = new Date(); // 정지 시각 기록
        return;
    }

    // 전체 종료 시 (완전 초기화)
    isWorkOrderRunning.value = false;
    workOrderPaused.value = false;
    workOrderStartTime.value = null;
    workOrderEndTime.value = null;
    currentProcIndex.value = 0;
    receivedAllProcs.value.forEach((proc) => {
        proc.status = 'WAITING';
        proc.procStartTime = null;
        proc.procEndTime = null;
        proc.realWorkQty = 0;
    });
};
// // 작업 상태 초기화 함수 (새로운 작업지시 선택 또는 전체 작업 종료 시 호출)
// const resetWorkOrderState = () => {
//     isWorkOrderRunning.value = false;
//     workOrderPaused.value = false;
//     workOrderStartTime.value = null;
//     workOrderEndTime.value = null;
//     currentProcIndex.value = 0;
//     // 모든 공정의 상태도 'WAITING'으로 초기화
//     receivedAllProcs.value.forEach((proc) => {
//         proc.status = 'WAITING';
//         proc.procStartTime = null;
//         proc.procEndTime = null;
//         proc.realWorkQty = 0;
//     });
// };

// --------------------------------------- Bom 부분 ---------------------------------------
// 여러 작업지시 데이터 저장 그리드 연결
const bomList = ref([]);

// BOM(Lot) 데이터 조회
const fetchBomList = async (modelCode, revision, workOrdNo) => {
    try {
        const res = await axios.get(`${apiUrl}/resultwork/bomlist`, {
            params: { modelCode, revision, workOrdNo }
        });
        // console.log('BOM 조회 결과:', res.data);
        bomList.value = res.data;
        console.log('bomList : ', bomList.value);
    } catch (err) {
        // console.error('❌ BOM 조회 실패:', err);
        bomList.value = [];
    }
};

// --------------------------------------- lot---------------------------------------
// lot모달 오픈 전 false 상태
const openLotModal = ref(false);
// 입력한 LOT번호
const searchLotNo = ref('');
// 선택된 행 데이터 담고있음
const selectedLot = ref({});
// DataTable에 보여질 데이터
const lot = ref([]);
// 선택된 lot번호 누적
const selectedLotNos = ref([]);
// 준비수량 확인 후 초과된 수량 저장
const overQtyMap = ref({});
// 초과된 itemCode를 저장
const blockedItems = ref(new Set());

// LOT번호 모달창 OPEN
const openModalWithLot = () => {
    // 모달창 open 시 lot 선택 초기화
    selectedLot.value = null;
    console.log('부모 검색 버튼 클릭:', searchLotNo.value);
    openLotModal.value = true;
};

// 그리드에 쓸 lotQty 값 저장용
const selectedLotQtyMap = ref({});

// 모달에서 선택된 Lot정보 받아오기
const onSelectLot = (data) => {
    console.log('data: ', data);

    // lot조회 선택시 bomList와 검증

    // 1단계: 이미 선택된 lot인지 확인  --------------------------------------- includes 는 배열이나 문자열에 특정한 값을 포함 여부를 확인하는 함수
    if (selectedLotNos.value.includes(data.lotNo)) {
        toast.add({
            severity: 'warn',
            summary: '중복 선택',
            detail: '이미 선택된 LOT입니다.',
            life: 2500
        });
        openLotModal.value = false;
        return;
    }

    // Bom에는 반제품이 들어가서 modelCode가 있지만 lot에는 자재만 있어서 modelCode 검증 필요가 없음

    // 2단계: itemCode 일치    조건 추가하려면 && 넣고 추가하면됨
    // targetBom에서 itemCode가 일치하면 true로 나와서 if(true)로 작동   == some의 결과는 true or false
    const targetBom = bomList.value.find((item) => item.itemCode === data.itemCode);
    if (!targetBom) {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: '일치하는 BOM 항목이 없습니다.',
            life: 2500
        });

        openLotModal.value = false;
        return;
    }

    // 리턴받은 lotQty값
    const resultQty = Number(data.lotQty) || 0; // undefined 방지
    const currentLotQty = Number(targetBom.lotQty) || 0; // 이미 누적된 lotQty
    const needQty = Number(targetBom.needQty) || 0; // 필요한 수량
    const newTotal = currentLotQty + resultQty;

    // ----------------------------- 3️⃣ 이미 초과로 차단된 품목인지 확인
    if (blockedItems.value.has(data.itemCode)) {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: `${data.itemCode}는 이미 필요수량을 초과하여 선택할 수 없습니다.`,
            life: 2500
        });
        openLotModal.value = false;
        return;
    }

    // needQty 초과 시 차단
    if (newTotal > needQty) {
        const over = newTotal - needQty;
        toast.add({
            severity: 'warn',
            summary: '수량 초과',
            detail: '준비수량이 필요수량을 초과했습니다.',
            life: 2500
        });

        // 초과량 저장
        // overQtyMap.value[targetBom.itemCode] = over;

        // 초과량 저장 lot까지 저장되도록 변경
        if (!overQtyMap.value[targetBom.itemCode]) {
            overQtyMap.value[targetBom.itemCode] = [];
        }

        // ✅ 어떤 LOT이 초과를 일으켰는지까지 기록
        overQtyMap.value[targetBom.itemCode].push({
            lotNo: data.lotNo,
            overQty: over
        });

        // 초과된 itemCode를 차단리스트에 추가
        blockedItems.value.add(data.itemCode);

        // lot 선택 해제 (다시 선택 불가)
        selectedLot.value = null;

        // 초과된 상태 반영 (선택은 허용)
        // targetBom.lotQty = newTotal; --------> 이렇게 하면 needQty 초과 상태로 남아 버튼 비활성화됨

        // [수정] 준비수량은 needQty까지만 인정 (isReady 조건 통과 가능)
        targetBom.lotQty = needQty;
        selectedLotQtyMap.value[data.itemCode] = needQty;

        openLotModal.value = false;
        return;
    }

    // 중복 아니고 초과도 아니면 lot 선택 반영
    // 선택된 lot번호 저장
    selectedLotNos.value.push(data.lotNo);

    // 누적 로직
    if (!selectedLotQtyMap.value[data.itemCode]) {
        selectedLotQtyMap.value[data.itemCode] = 0;
    }
    selectedLotQtyMap.value[data.itemCode] += Number(resultQty);
    // targetBom.lotQty도 함께 갱신
    targetBom.lotQty = selectedLotQtyMap.value[data.itemCode];

    selectedLot.value = data;
    lot.value = [data];
    openLotModal.value = false;
};

// 모달 닫힐 때 입력값 초기화
watch(openLotModal, (newVal) => {
    if (!newVal) {
        searchLotNo.value = '';
    }
});

// --------------------------------------- 버튼 ---------------------------------------
const isWorkOrderRunning = ref(false); // 전체 작업지시가 시작되었는지 여부
const workOrderPaused = ref(false); // 전체 작업지시가 일시정지 상태인지 여부
const workOrderStartTime = ref(null); // 전체 작업지시 시작 시간
const workOrderEndTime = ref(null); // 전체 작업지시 종료 시간

//여기서 디버깅 추가
console.log('bomList:', JSON.stringify(bomList.value));
console.log('selectedLotQtyMap:', JSON.stringify(selectedLotQtyMap.value));
console.log('realWorkQty:', realWorkQty.value);

// ✅ 버튼 활성화 조건: 모든 품목이 needQty 이상 준비되면 true
const isReady = computed(() => {
    // 여기서부터 디버깅 추가
    console.log('Checking isReady...');
    console.log('realWorkQty:', realWorkQty.value);

    // 실 작업수량이 0 이하거나 입력되지 않았으면 false
    if (!realWorkQty.value || realWorkQty.value <= 0) {
        // 여기서부터 디버깅 추가
        console.log('realWorkQty 조건 실패');
        return false;
    }

    if (!bomList.value || bomList.value.length === 0) {
        // 여기서부터 디버깅 추가
        console.log('bomList 조건 실패');
        return false;
    }

    const result = bomList.value.every((item) => {
        const itemCode = item.itemCode;
        const needQty = Number(item.needQty) || 0;
        const lotQty = Number(selectedLotQtyMap.value[itemCode]) || 0;
        console.log(`itemCode: ${itemCode}, needQty: ${needQty}, lotQty: ${lotQty}, 준비완료: ${lotQty >= needQty}`);
        return lotQty >= needQty;
    });

    console.log('최종 isReady 결과:', result); // 여기까지 추가
    return result;
});

const buttonSeverity = computed(() => (isWorkOrderRunning.value ? 'warn' : 'success'));
const buttonLabel = computed(() => (isWorkOrderRunning.value ? '일시정지' : '작업시작'));

// ---------------------- 2. 개별 공정 상태 관리 ----------------------
// receivedAllProcs는 각 공정 객체에 추가적인 상태 (startTime, endTime, status)를 포함
const receivedAllProcs = ref([]);
const currentProcIndex = ref(0); // 현재 진행 중인 공정의 인덱스

// Computed: 현재 활성화된 공정 객체
const currentProcess = computed(() => {
    if (receivedAllProcs.value.length === 0 || currentProcIndex.value >= receivedAllProcs.value.length) {
        return null;
    }
    return receivedAllProcs.value[currentProcIndex.value];
});

// Computed: 모든 공정이 완료되었는지 확인
const allProcsCompleted = computed(() => {
    // receivedAllProcs가 비어있지 않고, 모든 공정의 status가 'COMPLETED'인 경우
    return receivedAllProcs.value.length > 0 && receivedAllProcs.value.every((proc) => proc.status === 'COMPLETED');
});

// Computed: 현재 작업 공정을 표시할 값 (InputText 바인딩용)
const displayedCurrentProc = computed(() => {
    if (!currentProcess.value) {
        return allProcsCompleted.value ? '✨ 모든 공정 완료!' : '-';
    }
    const procName = typeof currentProcess.value.proc === 'string' ? currentProcess.value.proc : String(currentProcess.value.proc);
    const statusText =
        {
            WAITING: '(대기)',
            IN_PROGRESS: '(진행 중)',
            COMPLETED: '(완료)'
        }[currentProcess.value.status] || '';
    return `${procName} ${statusText}`;
});

// Computed: 전체 작업 공정을 '1->2->3' 형식으로 표시할 값 (InputText 바인딩용)
const displayedAllProcs = computed(() => {
    if (!receivedAllProcs.value.length) {
        return '공정 없음';
    }
    return receivedAllProcs.value
        .map((proc) => {
            // 여기서 proc.proc을 사용해서 공정명 가져오기
            const procName = proc.proc || '알 수 없는 공정';
            // 현재 공정이라면 특별히 표시해줄 수도 있어!
            if (proc === currentProcess.value) {
                return `[${procName}]`;
            } else if (proc.status === 'COMPLETED') {
                return `${procName}✅`;
            }
            return procName;
        })
        .join(' -> ');
});

// 작업 종료 시 일시정지버튼 비활성화
const allProcessesCompleted = computed(() => {
    return receivedAllProcs.value.length > 0 && receivedAllProcs.value.every((proc) => proc.status?.toUpperCase().trim() === 'COMPLETED');
});

watch(
    receivedAllProcs,
    (newVal) => {
        console.log('📦 현재 공정 리스트:', newVal);
        console.log('✅ 전체 완료 여부:', allProcessesCompleted.value);
    },
    { deep: true }
);
//
//
//
//

//
//
//
// 시작버튼 클릭 이벤트
const toggleWorkOrderRunning = async () => {
    console.log('currentProcess 확인:', currentProcess.value);

    // ⚠️ 시작 전 품목 준비량 확인 (작업이 시작되지 않은 상태에서만 검사)
    if (!isReady.value && !isWorkOrderRunning.value) {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: '모든 품목의 준비수량이 필요수량에 도달해야 작업을 시작할 수 있습니다.',
            life: 2500
        });
        return;
    }

    // ⚠️ 작업지시 선택 여부 확인
    if (!selectedWorkOrder.value || !selectedWorkOrder.value.workOrdNo) {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: '작업지시가 선택되지 않았습니다.',
            life: 2500
        });
        return;
    }

    let url = '';
    let payload = [];
    let successMsg = '';

    // 🟢 CASE 1: 처음 시작 또는 일시정지 후 재시작
    if (!isWorkOrderRunning.value) {
        url = `${apiUrl}/resultwork/save`;
        payload = [
            {
                workOrdNo: selectedWorkOrder.value.workOrdNo,
                modelCode: selectedWorkOrder.value.modelCode,
                revision: selectedWorkOrder.value.revision,
                proc_code: currentProcess.value?.proc_code || '작업시작',
                proc_seq: currentProcess.value?.proc_seq || 1,
                work_qty: realWorkQty.value,
                status: workOrderPaused.value ? 'RESUME' : 'START', // ✅ 재개 구분
                workStartTime: formatDateForMySQL(new Date())
            }
        ];
        successMsg = workOrderPaused.value ? '✅ 작업이 재개되었습니다.' : '✅ 작업이 시작되었습니다.';
    }
    // 🟡 CASE 2: 작업 중 → 일시정지
    else {
        url = `${apiUrl}/resultwork/pauseinsert`;
        payload = [
            {
                workOrdNo: selectedWorkOrder.value.workOrdNo,
                modelCode: selectedWorkOrder.value.modelCode,
                revision: selectedWorkOrder.value.revision,
                proc_code: '일시정지',
                work_qty: realWorkQty.value,
                status: 'PAUSE',
                workEndTime: formatDateForMySQL(new Date())
            }
        ];
        successMsg = '⏸ 작업이 일시정지되었습니다.';
    }

    try {
        const response = await axios.post(url, payload);
        console.log('서버 응답 (작업지시 컨트롤):', response.data);

        // ✅ 서버 응답 성공 시 상태 전환 처리
        if (response.data.isSuccessed && response.data.results[0].isSuccessed) {
            if (!isWorkOrderRunning.value) {
                // 작업 시작 or 재개
                isWorkOrderRunning.value = true;
                workOrderPaused.value = false;
                workOrderStartTime.value = new Date();
                toast.add({
                    severity: 'success',
                    summary: '작업 상태 변경',
                    detail: successMsg,
                    life: 2500
                });
            } else {
                // 일시정지
                isWorkOrderRunning.value = false;
                workOrderPaused.value = true;
                toast.add({
                    severity: 'warn',
                    summary: '작업 정지',
                    detail: successMsg,
                    life: 2500
                });
            }
        } else {
            toast.add({
                severity: 'warn',
                summary: '서버 응답 실패',
                detail: '❌ 작업 상태 변경이 서버에서 거부되었습니다.',
                life: 2500
            });
            console.error('서버 응답 실패:', response.data);
        }
    } catch (error) {
        console.error('데이터 전송 중 오류 발생 (작업지시 컨트롤):', error);
        toast.add({
            severity: 'warn',
            summary: '서버 응답 실패',
            detail: '❌ 작업지시 상태 변경 실패',
            life: 2500
        });
    }
};

// const toggleWorkOrderRunning = async () => {
//     console.log('currentProcess 확인:', currentProcess.value);

//     // ⚠️ 시작 전 품목 준비량 확인 (작업이 시작되지 않은 상태에서만 검사)
//     if (!isReady.value && !isWorkOrderRunning.value) {
//         // isWorkOrderRunning.value가 false일 때만 검사
//         toast.add({
//             severity: 'warn',
//             summary: '선택 불가',
//             detail: '모든 품목의 준비수량이 필요수량에 도달해야 작업을 시작할 수 있습니다.',
//             life: 2500
//         });
//         return;
//     }
//     // ⚠️ 작업지시 선택 여부 확인
//     if (!selectedWorkOrder.value || !selectedWorkOrder.value.workOrdNo) {
//         toast.add({
//             severity: 'warn',
//             summary: '선택 불가',
//             detail: '작업지시가 선택되지 않았습니다.',
//             life: 2500
//         });
//         return;
//     }

//     let url = '';
//     let payload = [];
//     let successMsg = '';

//     if (!isWorkOrderRunning.value) {
//         url = `${apiUrl}/resultwork/save`;
//         payload = [
//             {
//                 workOrdNo: selectedWorkOrder.value.workOrdNo,
//                 modelCode: selectedWorkOrder.value.modelCode,
//                 revision: selectedWorkOrder.value.revision,
//                 // ✅ 현재 공정이 있으면 그대로 재개, 없으면 첫 공정
//                 proc_code: currentProcess.value?.proc_code || '첫번째공정',
//                 proc_seq: currentProcess.value?.proc_seq || 1,
//                 work_qty: realWorkQty.value,
//                 status: workOrderPaused.value ? 'RESUME' : 'START', // ✅ 재개 상태 구분
//                 workStartTime: formatDateForMySQL(new Date())
//             }
//         ];
//         successMsg = workOrderPaused.value ? '✅ 작업이 재개되었습니다.' : '✅ 작업이 시작되었습니다.';
//     } else {
//         // CASE 2: 작업이 진행 중인 상태 ('일시정지' 버튼 클릭 = 정지 및 초기화)
//         url = `${apiUrl}/resultwork/pauseinsert`; // 'UPDATE' 로직 - 여기를 updateEnd로 변경!
//         payload = [
//             {
//                 workOrdNo: selectedWorkOrder.value.workOrdNo,
//                 modelCode: selectedWorkOrder.value.modelCode,
//                 revision: selectedWorkOrder.value.revision,
//                 proc_code: currentProcess.value ? currentProcess.value.proc_code || currentProcess.value.proc : '첫번째공정',
//                 work_qty: realWorkQty.value,
//                 status: 'PAUSE',
//                 workEndTime: formatDateForMySQL(new Date())
//             }
//             // {
//             //     workOrdNo: selectedWorkOrder.value.workOrdNo,
//             //     modelCode: selectedWorkOrder.value.modelCode,
//             //     revision: selectedWorkOrder.value.revision,
//             //     proc_code: currentProcess.value ? currentProcess.value.proc_code || currentProcess.value.proc || '첫번째공정' : '첫번째공정',
//             //     proc_seq: currentProcess.value ? currentProcess.value.proc_seq || 1 : 1,
//             //     work_qty: realWorkQty.value,
//             //     status: 'PAUSE', // ✅ UPDATE 대신 INSERT로 기록만 남김
//             //     workEndTime: formatDateForMySQL(new Date())
//             // }
//         ];
//     }

//     let workStatus = '';

//     if (!isWorkOrderRunning.value && !workOrderPaused.value) {
//         workStatus = 'START'; // 새로 시작
//     } else if (isWorkOrderRunning.value && !workOrderPaused.value) {
//         workStatus = 'PAUSE'; // 일시정지
//     } else if (workOrderPaused.value) {
//         workStatus = 'RESUME'; // 다시 시작
//     }

//     console.log('보내는 상태:', workStatus.value);

//     try {
//         const response = await axios.post(url, payload);
//         //
//         console.log('서버 응답 (작업지시 컨트롤):', response.data);

//         // UI 상태 업데이트
//         if (response.data.isSuccessed && response.data.results[0].isSuccessed) {
//             if (!isWorkOrderRunning.value) {
//                 // '작업시작' 성공
//                 isWorkOrderRunning.value = true;
//                 workOrderPaused.value = false; // 이 흐름에서는 사용되지 않지만 초기화
//                 workOrderStartTime.value = new Date();
//             } else {
//                 // '일시정지' (정지) 성공
//                 // resetWorkOrderState();  ---------------------> 이 부분 때문에 일시 정지 시 초기화 되어버림
//                 toast.add({
//                     severity: 'warn',
//                     summary: '작업 정지',
//                     detail: '⏸ 작업이 일시정지되었습니다. 다시 시작하려면 "작업시작"을 눌러주세요.',
//                     life: 2500
//                 });
//                 return;
//             }
//             toast.add({
//                 severity: 'success',
//                 summary: '작업 시작',
//                 detail: '✅ 작업이 시작되었습니다.',
//                 life: 2500
//             });
//         } else {
//             toast.add({
//                 severity: 'warn',
//                 summary: '서버 응답 실패',
//                 detail: '❌ 작업 상태 변경이 서버에서 거부되었습니다.',
//                 life: 2500
//             });
//             console.error('서버 응답 실패:', response.data);
//         }
//     } catch (error) {
//         console.error('데이터 전송 중 오류 발생 (작업지시 컨트롤):', error);
//         toast.add({
//             severity: 'warn',
//             summary: '서버 응답 실패',
//             detail: '❌ 작업지시 상태 변경 실패',
//             life: 2500
//         });
//     }
// };

// ---------------------- 5. 개별 공정 컨트롤 (공정시작/공정완료) ----------------------

const startProcessStep = async () => {
    if (!currentProcess.value || currentProcess.value.status !== 'WAITING') {
        toast.add({
            severity: 'warn',
            summary: '선택 불가',
            detail: '진행할 수 없는 공정입니다. 공정을 선택하거나 상태를 확인해주세요.',
            life: 2500
        });
        return;
    }

    // 서버로 해당 공정 시작 정보 전송
    const url = `${apiUrl}/resultwork/save`;
    const payload = [
        {
            workOrdNo: selectedWorkOrder.value.workOrdNo,
            modelCode: selectedWorkOrder.value.modelCode,
            revision: selectedWorkOrder.value.revision,
            proc_code: currentProcess.value ? currentProcess.value.proc_code || currentProcess.value.proc || '첫번째공정' : '첫번째공정',
            work_qty: realWorkQty.value,
            status: 'IN_PROGRESS',
            workStartTime: formatDateForMySQL(new Date())
        }
    ];

    try {
        const response = await axios.post(url, payload);
        console.log('서버 응답 (공정 시작):', response.data);

        // UI 상태 업데이트
        currentProcess.value.status = 'IN_PROGRESS';
        currentProcess.value.procStartTime = new Date();
        toast.add({
            severity: 'success',
            summary: '공정 시작 성공',
            detail: '공정이 시작되었습니다.',
            life: 2500
        });
    } catch (error) {
        console.error('공정 시작 데이터 전송 중 오류:', error);
        toast.add({
            severity: 'warn',
            summary: '공정 시작 실패',
            detail: '❌ 공정 시작 실패',
            life: 2500
        });
    }
};

const completeProcessStep = async () => {
    if (!currentProcess.value || currentProcess.value.status !== 'IN_PROGRESS') {
        toast.add({
            severity: 'warn',
            summary: '공정 시작 실패',
            detail: '진행 중인 공정이 아니거나 이미 완료된 공정입니다.',
            life: 2500
        });
        return;
    }

    // 서버로 해당 공정 완료 정보 전송
    const url = `${apiUrl}/resultwork/update`;
    const payload = [
        {
            work_qty: realWorkQty.value,
            status: 'COMPLETE',
            workEndTime: formatDateForMySQL(new Date()),
            workOrdNo: selectedWorkOrder.value.workOrdNo,
            proc_code: currentProcess.value ? currentProcess.value.proc_code || currentProcess.value.proc || '' : selectedWorkOrder.value.proc_code || ''
        }
    ];

    try {
        const response = await axios.post(url, payload);
        console.log('서버 응답 (공정 완료):', response.data);

        // UI 상태 업데이트
        currentProcess.value.status = 'COMPLETED';
        currentProcess.value.procEndTime = new Date();
        toast.add({
            severity: 'success',
            summary: '공정 완료',
            detail: '공정이 완료되었습니다.',
            life: 2500
        });

        // 다음 공정으로 이동
        // nextTick을 사용해서 DOM 업데이트가 완료된 후 인덱스를 변경하여 displayedCurrentProc가 정확히 반영되도록 함.
        nextTick(() => {
            currentProcIndex.value++;
            // 만약 다음 공정이 있다면 'WAITING' 상태로 만들어주기
            if (currentProcIndex.value < receivedAllProcs.value.length) {
                receivedAllProcs.value[currentProcIndex.value].status = 'WAITING';
            }
        });
    } catch (error) {
        console.error('공정 완료 데이터 전송 중 오류:', error);
        toast.add({
            severity: 'warn',
            summary: '공정 완료 실패',
            detail: '❌ 공정 완료 실패',
            life: 2500
        });
    }
};

// ---------------------- 6. 최종 작업 종료 ----------------------

const finishWorkOrder = async () => {
    // ⚠️ 모든 공정이 완료되었는지 다시 한 번 확인
    if (!allProcsCompleted.value) {
        toast.add({
            severity: 'warn',
            summary: '작업 종료 실패',
            detail: '⚠️ 모든 공정이 완료되어야 작업을 종료할 수 있습니다.',
            life: 2500
        });
        return;
    }
    if (!isWorkOrderRunning.value) {
        toast.add({
            severity: 'warn',
            summary: '작업 종료 실패',
            detail: '❌ 작업이 시작되지 않아 종료할 수 없습니다.',
            life: 2500
        });
        return;
    }

    // 서버로 최종 작업 종료 정보 전송 (realWorkQty 사용)
    const url = `${apiUrl}/resultwork/updateEnd`;
    const payload = [
        {
            workOrdNo: selectedWorkOrder.value.workOrdNo,
            modelCode: selectedWorkOrder.value.modelCode,
            revision: selectedWorkOrder.value.revision,
            proc_code: currentProcess.value?.proc_code || '',
            workQty: realWorkQty.value,
            status: 'END',
            workStartTime: workOrderStartTime.value,
            workEndTime: new Date(),
            usedLots: selectedLotNos.value // LOT 번호 배열 추가
        }
    ];

    try {
        const response = await axios.post(url, payload);
        console.log('서버 응답 (최종 작업 종료):', response.data);

        workOrderEndTime.value = new Date();
        toast.add({
            severity: 'success',
            summary: '작업 종료 성공',
            detail: '🎉 작업이 정상적으로 종료되었습니다.',
            life: 2500
        });

        // 모든 상태 초기화
        resetWorkOrderState();
        // 선택된 작업지시 비우기
        selectedWorkOrder.value = {
            workOrdNo: '',
            modelCode: '',
            revision: '',
            workOrdQty: null // 숫자라면 null이나 0
            // 기타 다른 속성들도 기본값으로 초기화
            // 사용자 입력 실 작업수량 비우기
        };
        realWorkQty.value = 0;
        // 현재 작업 공정 비우기
        currentProcess.value = null;
        // 전체 작업 공정 비우기
        receivedAllProcs.value = [];
        bomList.value = []; // BOM 리스트 비우기
    } catch (error) {
        console.error('데이터 전송 중 오류 발생 (최종 작업 종료):', error);
        toast.add({
            severity: 'warn',
            summary: '작업 종료 실패',
            detail: '❌ 최종 작업 종료 실패',
            life: 2500
        });
    }
};
</script>

<template>
    <div class="readingPart card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
            <label for="workord" class="flex items-center col-span-2 mb-2">작업지시서</label>
            <InputText v-model="searchWorkOrdNo" class="col-span-9" id="workord" type="text" />
            <Button @click="openModalWithSearch" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center col-span-2 mb-2">LOT번호</label>
            <InputText v-model="searchLotNo" class="col-span-9" id="lotNo" type="text" />
            <Button @click="openModalWithLot" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
    </div>

    <!-- 작업지시서 조회 결과-->
    <div class="modalform card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="flex items-center col-span-1">작업지시번호</label>
            <InputText v-model="selectedWorkOrder.workOrdNo" class="col-span-10" id="name3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="flex items-center col-span-1">작업제품정보</label>
            <InputText :value="modelInfo" class="col-span-10" id="email3" type="text" readonly />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="flex items-center col-span-1">작업지시수량</label>
            <InputText v-model="selectedWorkOrder.workOrdQty" class="col-span-3" id="email3" type="text" readonly />

            <div class="col-span-1"></div>

            <label for="email3" class="flex items-center col-span-1">예상작업수량</label>
            <InputText v-model.number="realWorkQty" class="col-span-5" id="email3" type="number" placeholder="예상작업수량을 입력해주세요." />
        </div>

        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="currentProcDisplay" class="flex items-center col-span-1">현재작업공정</label>
            <InputText v-model="displayedCurrentProc" class="col-span-3" id="currentProcDisplay" type="text" readonly />
            <div class="col-span-1 flex items-center justify-center">
                <Button
                    label="공정시작"
                    severity="success"
                    @click="startProcessStep"
                    :disabled="
                        !isWorkOrderRunning || // 전체 작업지시가 시작되지 않았으면 비활성화
                        !currentProcess || // 현재 공정이 없으면 비활성화
                        currentProcess.status !== 'WAITING' // 현재 공정이 'WAITING' 상태가 아니면 비활성화
                    "
                />
                <Button
                    label="공정완료"
                    severity="info"
                    @click="completeProcessStep"
                    :disabled="
                        !isWorkOrderRunning || // 전체 작업지시가 시작되지 않았으면 비활성화
                        !currentProcess || // 현재 공정이 없으면 비활성화
                        currentProcess.status !== 'IN_PROGRESS' // 현재 공정이 'IN_PROGRESS' 상태가 아니면 비활성화
                    "
                    class="ml-1"
                />
            </div>
            <label for="allProcsDisplay" class="flex items-center col-span-1">전체작업공정</label>
            <InputText v-model="displayedAllProcs" class="col-span-5" id="allProcsDisplay" type="text" readonly />
        </div>
        <div class="col-span-12 mt-4">
            <p><strong>작업지시 상태:</strong> {{ isWorkOrderRunning ? (workOrderPaused ? '일시정지 중' : '진행 중') : '대기 중' }}</p>
            <p v-if="workOrderStartTime"><strong>시작 시각:</strong> {{ new Date(workOrderStartTime).toLocaleString() }}</p>
            <p v-if="workOrderEndTime"><strong>종료 시각:</strong> {{ new Date(workOrderEndTime).toLocaleString() }}</p>
        </div>

        <!-- LOT번호 조회 결과-->
        <DataTable :value="bomList" v-model:selection="selectedLot" datakey="lotNo" scrollable scrollHeight="22vh" style="height: 22vh" class="custom-table" @rowSelect="formData = { ...$event.data }">
            <Column field="itemCode" header="소요품번" style="min-width: 150px"></Column>
            <Column field="itemName" header="소요품명" style="min-width: 250px"></Column>
            <Column field="needQty" header="필요수량" style="min-width: 150px"></Column>
            <Column field="lotQty" header="준비수량" style="min-width: 150px"></Column>
            <Column header="초과량" style="min-width: 150px">
                <template #body="slotProps">
                    {{ overQtyMap[slotProps.data.itemCode] ? overQtyMap[slotProps.data.itemCode].map((o) => `${o.lotNo} (${o.overQty})`).join(', ') : '' }}
                </template>
            </Column>
            <!-- <Column header="초과량" style="min-width: 150px">
                <template #body="slotProps">
                    {{ overQtyMap[slotProps.data.itemCode] || 0 }}
                </template>
            </Column> -->
            <Column field="unit" header="단위" style="min-width: 150px"></Column>
        </DataTable>

        <Dialog v-model:visible="openWorkOrdModal" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
            <WorkOrderModal :searchWorkOrdNo="searchWorkOrdNo" @workOrdreg="onWorkOrderSelected" />
        </Dialog>
        <Dialog v-model:visible="openLotModal" header="LOT 조회" modal style="width: 80vw; height: 80vh">
            <LotModal :searchLotNo="searchLotNo" @lotreg="onSelectLot" />
        </Dialog>
    </div>
    <div class="buttons">
        <!-- 전체 작업지시 컨트롤 버튼 -->
        <div class="col-span-12 text-center my-4">
            <Button :label="buttonLabel" :severity="buttonSeverity" @click="toggleWorkOrderRunning" :disabled="!isReady || !realWorkQty || allProcessesCompleted" />
            <Button severity="danger" label="작업종료" @click="finishWorkOrder" :disabled="!isWorkOrderRunning || !allProcsCompleted" class="ml-2" />
        </div>
    </div>
</template>

<style scoped>
.readingPart {
    padding: 15px;
    margin-bottom: 20px;
}
:deep(.custom-table .p-datatable-tbody > tr > td) {
    font-size: 1rem !important;
    padding: 4px 8px;
}
.custom-table {
    height: 22vh;
    border: 1px solid #ddd;
    margin-bottom: 20px;
}
.buttons button {
    height: 6vh;
    width: 40vh;
}
.buttons {
    text-align: center;
}
.modalform {
    padding: 20px;
    margin-bottom: 0;
}
</style>
