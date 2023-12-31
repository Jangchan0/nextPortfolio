/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
        screens: {
            sm: { max: '798px' },
            md: { min: '799px', max: '1079px' },
            lg: { min: '1080px' },
        },
    },
    darkMode: 'class',
    plugins: [],
};
