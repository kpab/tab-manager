/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#292d3e',
                'secondary': '#1f2430',
                'accent-red': '#f07178',
                'accent-blue': '#82aaff',
                'accent-yellow': '#ffcb6b',
                'accent-purple': '#c792ea',
                'text-primary': '#a6accd',
                'text-secondary': '#676e95',
            }
        },
    },
    plugins: [],
}