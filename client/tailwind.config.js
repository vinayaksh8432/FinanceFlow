/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) , <alpha-value>)",
                secondary: "rgb(var(--color-secondary) , <alpha-value>)",
                tertiary: "rgb(var(--color-tertiary) , <alpha-value>)",
            },
        },
    },
    plugins: [],
};
