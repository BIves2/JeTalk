import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"

export default [
    {
        ignores: [
            "dist",
            "node_modules",
            "models",
            "src/generated",
            ".agents",
            "public"
        ]
    },
    js.configs.recommended,
    reactHooks.configs.flat.recommended,
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parserOptions: {
                ecmaFeatures: { jsx: true }
            }
        },
        plugins: {
            "react-refresh": reactRefresh
        },
        rules: {
            "no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^[A-Z_]"
            }],
            "react-refresh/only-export-components": ["warn", {
                allowConstantExport: true
            }],
            "no-empty": "warn",
            "no-useless-escape": "warn",
            // Règles React 19 déjà présentes dans le code existant :
            // conservées en avertissement pour ne pas bloquer le lint.
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/refs": "warn"
        }
    }
]
