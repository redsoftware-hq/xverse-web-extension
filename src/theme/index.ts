export const breakpoints = {
  xs: '360',
  s: '480',
  md: '768',
  lg: '920',
  xl: '1200',
};

export const devices = {
  min: {
    xs: `(min-width: ${breakpoints.xs}px)`,
    s: `(min-width: ${breakpoints.s}px)`,
    md: `(min-width: ${breakpoints.md}px)`,
    lg: `(min-width: ${breakpoints.lg}px)`,
    xl: `(min-width: ${breakpoints.xl}px)`,
  },
  max: {
    xs: `(max-width: ${breakpoints.xs}px)`,
    s: `(max-width: ${breakpoints.s}px)`,
    md: `(max-width: ${breakpoints.md}px)`,
    lg: `(max-width: ${breakpoints.lg}px)`,
    xl: `(max-width: ${breakpoints.xl}px)`,
  },
};

const Theme = {
  spacing: (multiple: number) => multiple * 2,
  space: {
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '40px',
    xxxl: '64px',
    xxxxl: '80px',
  } as const,
  radius: (multiple: number) => multiple * 4 + 4,

  /*
   * Colors from UI Revamp here:
   * ref: https://zeroheight.com/0683c9fa7/p/606387-colors
   */
  colors: {
    white_0: '#FFFFFF',
    white_200: 'rgba(255, 255, 255, 0.8)',
    white_400: 'rgba(255, 255, 255, 0.6)',
    white_600: 'rgba(255, 255, 255, 0.4)',
    white_800: 'rgba(255, 255, 255, 0.2)',
    white_850: 'rgba(255, 255, 255, 0.15)',
    white_900: 'rgba(255, 255, 255, 0.1)',

    elevation_n1: '#0C0C0C',
    elevation0: '#181818',
    elevation1: '#1E2024',
    elevation2: '#24282F',
    elevation3: '#2A2F39',
    elevation5: '#303643',
    elevation6: '#4C525F',
    elevation6_600: 'rgba(76, 82, 95, 0.4)',
    elevation6_800: 'rgba(76, 82, 95, 0.2)',
    elevation8: '#7A7688',

    // feedback
    danger_light: '#FF5A5A',
    danger_medium: '#EA4848',
    danger_dark: '#AB3030',
    danger_dark_100: 'rgba(171, 48, 48, 0.9)',
    danger_dark_200: 'rgba(171, 48, 48, 0.8)',
    danger_dark_600: 'rgba(171, 48, 48, 0.4)',
    success_light: '#55E078',
    success_medium: '#55B86E',
    success_dark: '#3B884E',
    success_dark_600: 'rgba(59,136,78,0.4)',
    success_pill: '#42BF23',
    caution: '#F2A900',
    caution_800: 'rgba(242, 169, 0, 0.2)',

    // brand
    emerald_light: '#55B86E',
    emerald: '#49A15F',
    emerald_dark: '#3E8A51',
    tangerine_light: '#EF883B',
    tangerine: '#EE7A30',
    tangerine_dark: '#D96F2A',
    lilac_light: '#6E54CB',
    lilac: '#5E41C5',
    lilac_dark: '#4F34BA',

    // orange-pill-wallet
    secondaryText: '#626A82',
    success_gradient:
      'linear-gradient(90deg, rgba(66, 191, 35, 0.20) 0%, rgba(66, 191, 35, 0.00) 31.87%), radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
    toast: {
      successBorder: '1px solid rgba(168, 185, 244, 0.15)',
    },
    action: {
      classic: '#D23403',
      classicYou: '#D2340333',
      classicLight: 'rgba(210, 52, 3, 0.85)',
      classic800: 'rgba(85, 101, 247, 0.2)',
    },
    white: {
      /**
       * @deprecated use theme.colors.white_0
       */
      0: '#FFFFFF',

      /**
       * @deprecated use theme.colors.white_200
       */
      200: 'rgba(255, 255, 255, 0.8)',

      /**
       * @deprecated use theme.colors.white_400
       */
      400: 'rgba(255, 255, 255, 0.6)',

      /**
       * @deprecated use theme.colors.white_600
       */
      600: 'rgba(255, 255, 255, 0.4)',

      /**
       * @deprecated use theme.colors.white_800
       */
      800: 'rgba(255, 255, 255, 0.2)',

      /**
       * @deprecated use theme.colors.white_850
       */
      850: 'rgba(255, 255, 255, 0.15)',

      /**
       * @deprecated use theme.colors.white_900
       */
      900: 'rgba(255, 255, 255, 0.1)',
    },
    dashboard: {
      text: '#FFA589',
    },
    background: {
      orangePillBg: 'radial-gradient(157.22% 121.91% at 17.22% 10.5%, #0D0E12 0%, #000 75.87%)',
      sliderBg: 'rgba(210, 52, 3, 0.20)',
      hoverPopup:
        'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%), rgba(0, 0, 0, 0.80)',
      darkbg: '#0E1015',
      navigation: 'radial-gradient(157.22% 121.91% at 17.22% 10.50%, #0D0E12 0%, #000 75.87%)',
      'elevation-1': '#070A13',
      elevationDarkGradient: `radial-gradient(85.58% 229.24% at 89.79% 22.85%, rgba(56, 60, 78, 0.2) 0%, rgba(13, 14, 18, 0.2) 100%),
              linear-gradient(154.76deg, rgba(168, 185, 244, 0.12) 15.61%, rgba(168, 185, 244, 0.06) 62.02%);`,
      elevationZero: 'rgba(168, 185, 244, 0.05)',
      elevation0_5: 'rgba(168, 185, 244, 0.1)',
      elevation0: '#040405',
      elevation1: '#1D2032',
      elevation2: '#272A44',
      elevation3: '#303354',
      elevation6: '#4C5187',
      elevation6_600: 'rgba(76, 81, 135, 0.4)',
      elevation6_800: 'rgba(76, 81, 135, 0.2)',
      elevation8: '#7E89AB',
      elevation9: 'rgba(76, 81, 135, 0.2)',

      /**
       * @deprecated
       */
      elevation10: 'rgba(76, 81, 135, 0.35)',

      modalBackdrop: 'rgba(18,21,30,0.6)',
      lightOrange: 'rgba(210, 52, 3, 0.2)',
    },

    feedback: {
      /**
       * @deprecated use theme.colors.success_medium
       */
      success: '#55B86E',

      /**
       * @deprecated use theme.colors.caution
       */
      caution: '#F2A900',

      /**
       * @deprecated use theme.colors.danger_medium
       */
      error: '#EA4848',

      /**
       * @deprecated use theme.colors.danger_dark_600
       */
      error_700: 'rgba(171, 48, 48, 0.4)',
    },

    /**
     * @deprecated
     */
    grey: '#24252C',

    /**
     * @deprecated use lilac
     */
    purple_main: '#5E41C5',
    orange_main: ' #EE7A30',
    grey1: '#626A82',
  },
  hover: { border: '1px solid rgba(168, 185, 244, 0.15)' },
  typography: {
    headline_xl: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 40,
      letterSpacing: 0.02,
      lineHeight: '125%',
    },
    headline_l: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 34,
      letterSpacing: 0.02,
      lineHeight: '125%',
    },
    headline_m: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 28,
      letterSpacing: 0.02,
      lineHeight: '140%',
    },
    headline_s: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 24,
      letterSpacing: 0.02,
      lineHeight: '140%',
    },
    headline_xs: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 20,
      letterSpacing: 0.02,
      lineHeight: '125%',
    },
    body_bold_l: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 16,
    },
    body_medium_l: {
      fontFamily: 'MontSemiBold',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
    },
    body_l: {
      fontFamily: 'MontRegular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 16,
    },
    body_bold_m: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 14,
    },
    body_medium_m: {
      fontFamily: 'MontSemiBold',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 14,
    },
    body_m: {
      fontFamily: 'MontRegular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 14,
    },
    body_bold_s: {
      fontFamily: 'MontBold',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 12,
    },
    body_medium_s: {
      fontFamily: 'MontSemiBold',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 12,
    },
    body_s: {
      fontFamily: 'MontRegular',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 12,
    },
  },
  backdrop: {
    hover: 'blur(10px)',
  },
  boxShadow: {
    hover: '0px 6px 10px 0px rgba(0, 0, 0, 0.50)',
  },
  scrollbar: {
    scrollbarGutter: 'stable both-edges',
    'overflow-y': 'hidden',
    ':hover': {
      'overflow-y': 'auto',
    },
    '::-webkit-scrollbar': {
      display: 'block',
      width: 8,
      background: 'rgba(255, 255, 255, 0.10)',
    },
    '::-webkit-scrollbar-thumb': {
      width: 8,
      maxHeight: 10,
      borderRadius: 24,
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  headline_category_m: {
    fontFamily: 'MontSemibold',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 0.02,
    textTransform: 'uppercase',
  },
  headline_category_s: {
    fontFamily: 'MontSemibold',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 11,
    letterSpacing: 0.02,
  },
  body_bold_l: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
  },
  body_medium_l: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
  },
  body_medium_xl: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
  },
  body_medium_2xl: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
  },
  body_l: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
  },
  body_bold_m: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
  },
  body_medium_m: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
  },
  body_m: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
  },
  body_xs: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
  },

  /**
   * @deprecated use theme.typography
   */
  headline_xl: {
    fontFamily: 'MontRegular',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 42,
    letterSpacing: 0.02,
  },

  /**
   * @deprecated use theme.typography
   */
  tile_text: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.02,
  },
  mont_tile_text: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 32,
    letterSpacing: 0.02,
  },
  bold_tile_text: {
    fontFamily: 'MontSemiBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.02,
  },

  /**
   * @deprecated use theme.typography
   */
  headline_l: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 34,
    letterSpacing: 0.02,
  },
  mont_headline_normal: {
    fontFamily: 'MontRegular',
    fontSize: 40,
  },
  mont_headline_bold: {
    fontFamily: 'MontSemiBold',
    fontSize: 40,
  },
  mont_light: {
    fontFamily: 'MontLight',
  },
  headline_m: {
    fontFamily: 'MontBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: 0.02,
  },

  /**
   * @deprecated use theme.typography
   */
  headline_s: {
    fontFamily: 'MontSemiBold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 21,
    letterSpacing: 0.02,
  },
};

export type Color = keyof typeof Theme.colors | 'currentColor';
export type Typography = keyof typeof Theme.typography;

export default Theme;
