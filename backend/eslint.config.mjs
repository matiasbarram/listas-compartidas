import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import prettierConfig from "eslint-config-prettier"

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        ignores: [
            "docker-data/",
            "dist/",
            "node_modules/",
            "dumps/",
            "logs/",
            "*.json",
            "*.lock",
            ".pnp.cjs",
            ".yarn/",
        ],
    },
    prettierConfig,
)
