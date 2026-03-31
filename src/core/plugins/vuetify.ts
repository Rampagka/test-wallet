import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    background: '#0F1114',
                    surface: '#1C1F26',
                    'surface-variant': '#252830',
                    primary: '#f38226',
                    secondary: '#8B8E96',
                    success: '#4CAF50',
                    error: '#EF5350',
                    warning: '#FFA726',
                },
            },
        },
    },
    defaults: {
        VBtn: {
            style: 'text-transform: none; letter-spacing: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
        },
    },
})
