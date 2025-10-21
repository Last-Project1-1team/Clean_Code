import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                //
                // 기준정보
                //
                {
                    path: '/pages/commoncode',
                    name: 'commoncode',
                    component: () => import('@/views/pages/CommonCode.vue')
                },
                {
                    path: '/pages/codegroup',
                    name: 'codegroup',
                    component: () => import('@/views/pages/CodeGroup.vue')
                },
                {
                    path: '/pages/useraccount',
                    name: 'useraccount',
                    component: () => import('@/views/pages/UserAccount.vue')
                },
                {
                    path: '/pages/totalmenu',
                    name: 'totalmenu',
                    component: () => import('@/views/pages/TotalMenu.vue')
                },

                //
                // 자재관리
                //
                {
                    path: '/pages/itemmaster',
                    name: 'itemmaster',
                    component: () => import('@/views/pages/ItemMaster.vue')
                },
                {
                    path: '/pages/outorderreg',
                    name: 'outorderreg',
                    component: () => import('@/views/pages/OutOrderReg.vue')
                },
                {
                    path: '/pages/iteminput',
                    name: 'iteminput',
                    component: () => import('@/views/pages/ItemInput.vue')
                },
                {
                    path: '/pages/iteminputconfirm',
                    name: 'iteminputconfirm',
                    component: () => import('@/views/pages/ItemInputConfirm.vue')
                },
                {
                    path: '/pages/itemoutput',
                    name: 'itemoutput',
                    component: () => import('@/views/pages/ItemOutput.vue')
                },
                {
                    path: '/pages/itemoutputsearch',
                    name: 'itemoutputsearch',
                    component: () => import('@/views/pages/ItemOutputSearch.vue')
                },
                {
                    path: '/pages/iteminspreg',
                    name: 'iteminspreg',
                    component: () => import('@/views/pages/ItemInspReg.vue')
                },
                {
                    path: '/pages/outordersearch',
                    name: 'outordersearch',
                    component: () => import('@/views/pages/OutOrderSearch.vue')
                },
                {
                    path: '/pages/iteminputsearch',
                    name: 'iteminputsearch',
                    component: () => import('@/views/pages/ItemInputSearch.vue')
                },
                {
                    path: '/pages/itemstock',
                    name: 'itemstock',
                    component: () => import('@/views/pages/ItemStockSearch.vue')
                },
                {
                    path: '/pages/itemlot',
                    name: 'itemlot',
                    component: () => import('@/views/pages/ItemLotSearch.vue')
                },
                //
                // 생산관리
                //
                {
                    path: '/pages/modelmaster',
                    name: 'model',
                    component: () => import('@/views/pages/ModelMaster.vue')
                },
                {
                    path: '/pages/bom',
                    name: 'bom',
                    component: () => import('@/views/pages/BOM.vue')
                },
                {
                    path: '/pages/bomhistory',
                    name: 'bomhistory',
                    component: () => import('@/views/pages/BOMHistory.vue')
                },
                {
                    path: '/pages/workorder',
                    name: 'workorder',
                    component: () => import('@/views/pages/WorkOrder.vue')
                },
                {
                    path: '/pages/searchprodplan',
                    name: 'searchprodplan',
                    component: () => import('@/views/pages/SearchProdPlan.vue')
                },
                {
                    path: '/pages/addprodplan',
                    name: 'addprodplan',
                    component: () => import('@/views/pages/AddProdPlan.vue')
                },
                {
                    path: '/pages/resultwork',
                    name: 'resultwork',
                    component: () => import('@/views/pages/ResultWork.vue')
                },
                {
                    path: '/pages/receiving',
                    name: 'receiving',
                    component: () => import('@/views/pages/Receiving.vue')
                },
                //
                // 영업관리
                //
                {
                    path: '/pages/InOrderReg',
                    name: 'OrderForm',
                    component: () => import('@/views/pages/InOrderReg.vue')
                },
                {
                    path: '/pages/OrderList',
                    name: 'OrderList',
                    component: () => import('@/views/pages/InOrderList.vue')
                },
                {
                    path: '/pages/ModelShip',
                    name: 'ModelShip',
                    component: () => import('@/views/pages/ModelShip.vue')
                },
                {
                    path: '/pages/ShipList',
                    name: 'ShipList',
                    component: () => import('@/views/pages/ShipList.vue')
                },

                //
                // 재고관리
                //

                //
                //기타
                //
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/pages/auth/custmodal',
            name: 'custmodal',
            component: () => import('@/views/pages/auth/custmodal.vue')
        }
    ]
});

export default router;
