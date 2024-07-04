/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'loginPage': "url('./public/images/login/phongcanh.jpg')"
            },
            colors: {
                'textBlueMain': "#1677ff"
            }
        },
    },
    plugins: [],
}