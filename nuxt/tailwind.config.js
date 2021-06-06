const defaultTheme = require('tailwindcss/defaultTheme')

function heading(theme) {
  return {
    fontFamily: 'Montserrat',
    fontWeight: theme('fontWeight.bold'),
    marginBottom: theme('margin.1'),
    marginTop: theme('margin.4'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

module.exports = {
  darkMode: 'media',
  mode: 'jit',
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.6s ease-in-out 0s 1 normal forwards running',
      },
      colors: {
        background: {
          bright: '#f0f0f0',
          dark: '#202020',
        },
        link: {
          bright: '#60a5fa', // theme('colors.blue.400')
          dark: '#1d4ed8', // theme('colors.blue.700')
        },
        text: {
          bright: '#fafafa', // theme('colors.gray.50')
          dark: '#27272a', // theme('colors.gray.800')
        },
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        shake: {
          '0%': {
            transform: 'translateX(0)',
          },
          '15%': {
            transform: 'translateX(0.375rem)',
          },
          '30%': {
            transform: 'translateX(-0.375rem)',
          },
          '45%': {
            transform: 'translateX(0.375rem)',
          },
          '60%': {
            transform: 'translateX(-0.375rem)',
          },
          '75%': {
            transform: 'translateX(0.375rem)',
          },
          '90%': {
            transform: 'translateX(-0.375rem)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      screens: {
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text.dark'),
            a: {
              color: theme('colors.link.dark'),
              textDecoration: 'none',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.text.bright'),
            a: {
              color: theme('colors.link.bright'),
            },
            h1: {
              color: theme('colors.text.bright'),
            },
            h2: {
              color: theme('colors.text.bright'),
            },
            h3: {
              color: theme('colors.text.bright'),
            },
            h4: {
              color: theme('colors.text.bright'),
            },
            h5: {
              color: theme('colors.text.bright'),
            },
            h6: {
              color: theme('colors.text.bright'),
            },
            '.card &': {
              color: theme('colors.text.dark'),
              a: {
                color: theme('colors.link.dark'),
              },
              h1: {
                color: theme('colors.text.dark'),
              },
              h2: {
                color: theme('colors.text.dark'),
              },
              h3: {
                color: theme('colors.text.dark'),
              },
              h4: {
                color: theme('colors.text.dark'),
              },
              h5: {
                color: theme('colors.text.dark'),
              },
              h6: {
                color: theme('colors.text.dark'),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      margin: ['last'],
      typography: ['dark'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        '@font-face': {
          fontDisplay: 'swap',
          fontFamily: 'Montserrat',
          src: "local('Montserrat Medium'), local('Montserrat-Medium'), url(/assets/static/fonts/montserrat/montserrat-medium.woff2) format('woff2')",
          unicodeRange:
            'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
        },
        ':disabled': {
          cursor: theme('cursor.not-allowed'),
          opacity: theme('opacity.50'),
        },
        '::placeholder': {
          fontStyle: 'italic',
          'input&,textarea&': {
            opacity: 0.5,
          },
        },
        '::selection': {
          color: theme('colors.text.bright'),
          background: '#e53e3e',
        },
        a: {
          color: theme('colors.link.dark'),
          '@screen dark-mode': {
            color: theme('colors.link.bright'),
          },
        },
        'a[target="_blank"]:after': {
          backgroundColor: theme('colors.text.dark'),
          content: '""',
          display: 'inline-block',
          mask: 'url(data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJleHRlcm5hbC1saW5rLWFsdCIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLWV4dGVybmFsLWxpbmstYWx0IGZhLXctMTYiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNNDMyLDMyMEg0MDBhMTYsMTYsMCwwLDAtMTYsMTZWNDQ4SDY0VjEyOEgyMDhhMTYsMTYsMCwwLDAsMTYtMTZWODBhMTYsMTYsMCwwLDAtMTYtMTZINDhBNDgsNDgsMCwwLDAsMCwxMTJWNDY0YTQ4LDQ4LDAsMCwwLDQ4LDQ4SDQwMGE0OCw0OCwwLDAsMCw0OC00OFYzMzZBMTYsMTYsMCwwLDAsNDMyLDMyMFpNNDg4LDBoLTEyOGMtMjEuMzcsMC0zMi4wNSwyNS45MS0xNyw0MWwzNS43MywzNS43M0wxMzUsMzIwLjM3YTI0LDI0LDAsMCwwLDAsMzRMMTU3LjY3LDM3N2EyNCwyNCwwLDAsMCwzNCwwTDQzNS4yOCwxMzMuMzIsNDcxLDE2OWMxNSwxNSw0MSw0LjUsNDEtMTdWMjRBMjQsMjQsMCwwLDAsNDg4LDBaIj48L3BhdGg+PC9zdmc+) no-repeat 50% 50%',
          maskSize: 'cover',
          height: theme('fontSize.xs'),
          marginLeft: '5px',
          width: theme('fontSize.xs'),
          '@screen dark-mode': {
            backgroundColor: theme('colors.text.bright'),
          },
        },
        address: {
          margin: theme('margin.4'),
        },
        body: {
          background: theme('colors.background.bright'),
          '@screen dark-mode': {
            background: theme('colors.background.dark'),
          },
        },
        footer: {
          background: '#ffffff',
          '@screen dark-mode': {
            background: '#282828',
          },
        },
        h1: {
          ...heading(theme),
          fontSize: theme('fontSize.4xl'),
          marginBottom: theme('margin.4'),
          textAlign: 'center',
        },
        h2: {
          ...heading(theme),
          fontSize: theme('fontSize.3xl'),
        },
        h3: {
          ...heading(theme),
          fontSize: theme('fontSize.2xl'),
        },
        h4: {
          ...heading(theme),
          fontSize: theme('fontSize.xl'),
        },
        img: {
          '&::before': {
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
          },
        },
      })
      addComponents({
        '.button': {
          backgroundColor: theme('colors.red.600'),
          borderRadius: theme('borderRadius.full'),
          boxShadow: theme('boxShadow.DEFAULT'),
          color: theme('colors.text.bright'),
          display: 'inline-block',
          fontWeight: theme('fontWeight.bold'),
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: theme('padding.2') + ' ' + theme('padding.4'),
          '&:focus': {
            boxShadow: theme('ringWidth.DEFAULT'),
          },
          '&:hover': {
            backgroundColor: theme('colors.red.700'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderColor: theme('colors.gray.300'),
          borderRadius: theme('borderRadius.DEFAULT'),
          borderWidth: theme('borderWidth.DEFAULT'),
          boxShadow: theme('boxShadow.md'),
          color: theme('colors.text.dark'),
          padding: theme('padding.4'),
          'a[target="_blank"]:after': {
            backgroundColor: theme('colors.text.dark'),
          },
          form: {
            label: {
              color: theme('colors.gray.600'),
            },
          },
        },
        '.description': {
          p: {
            margin: theme('margin.2') + ' ' + theme('margin.0'),
          },
        },
        '.flip-card': {
          perspective: '1000px',
        },
        '.flip-card-inner': {
          transition: 'transform 0.7s',
          transformStyle: 'preserve-3d',
        },
        '.flip-card.flipped .flip-card-inner': {
          transform: 'rotateY(180deg)',
        },
        '.flip-card-front, .flip-card-back': {
          backfaceVisibility: 'hidden',
        },
        '.flip-card-front': {
          transform: 'rotateY(-180deg)',
        },
        '.flip-card-back': {
          transform: 'rotateY(0deg)',
        },
        '.form-input-error': {
          input: {
            borderColor: theme('colors.red.500'),
          },
        },
        '.form-input': {
          appearance: 'none',
          backgroundColor: theme('colors.gray.200'),
          borderColor: theme('colors.gray.200'),
          borderRadius: theme('borderRadius.DEFAULT'),
          borderWidth: theme('borderWidth.2'),
          color: theme('colors.gray.700'),
          lineHeight: theme('lineHeight.tight'),
          padding: theme('padding.2') + ' ' + theme('padding.4'),
          width: theme('width.full'),
          '&:focus': {
            backgroundColor: theme('colors.white'),
            borderColor: theme('colors.purple.400'),
          },
        },
        '.pills': {
          display: 'flex',
          justifyContent: 'space-between',
          li: {
            width: theme('width.full'),
            button: {
              fontWeight: theme('fontWeight.semibold'),
              padding: theme('padding.2') + ' ' + theme('padding.4'),
              width: theme('width.full'),
            },
          },
        },
      })
      addUtilities({
        '.button-list': {
          margin: theme('margin.2') + ' ' + theme('margin.-2'),
          '> *': {
            margin: theme('margin.2'),
          },
        },
        '.disabled': {
          cursor: theme('cursor.not-allowed'),
          opacity: theme('opacity.50'),
        },
        '.e1': {
          gridRow: '1',
          gridColumn: '1',
        },
        '.inline-grid': {
          display: 'inline-grid',
        },
        '.line-clamp-box': {
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '-webkit-box-orient': 'vertical',
        },
        '.line-clamp-2': {
          '-webkit-line-clamp': '2',
        },
        '.max-h-90vh': {
          maxHeight: '90vh',
        },
        '.font-family-montserrat': {
          fontFamily: 'Montserrat',
        },
      })
    },
  ],
}
