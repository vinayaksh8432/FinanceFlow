/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) , <alpha-value>)",
                secondary: "rgb(var(--color-secondary) , <alpha-value>)",
                tertiary: "rgb(var(--color-tertiary) , <alpha-value>)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            height: { 18: "4.5rem" },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
