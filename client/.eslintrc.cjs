require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-reserved-component-names': 'off',
        'vue/no-v-model-argument': 'off', // Vue3 v-model:prop 허용
        'vue/no-multiple-template-root': 'off', // Vue3 Fragment 허용
        'no-unused-vars': 'off', // 개발 중 unused 무시
        'vue/component-tags-order': [
            'error',
            {
                order: ['script', 'template', 'style']
            }
        ],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ]
    }
};
