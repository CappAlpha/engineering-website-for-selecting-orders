import { useEffect, useState } from 'react';

export const useMedia = (query: string, defaultState: boolean = false) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);

    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(mql.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      mql.addListener(onChange);
    }
    setState(mql.matches);

    return () => {
      mounted = false;
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange);
      }
      setState(mql.matches);
    };
  }, [query]);

  return state;
};

export type Breakpoint = 'mobile' | 'mobileM' | 'tablet' | 'desktopS' | 'desktop' | 'desktopL';
export type BreakpointType = 'max' | 'min';
export type BreakpointWithDesktopWide = Breakpoint | 'desktopWide';

export const breakpoints: Record<Breakpoint, number> = {
  mobile: 360,
  mobileM: 768,
  tablet: 1024,
  desktopS: 1280,
  desktop: 1440,
  desktopL: 1600,
};

export const useBreakpoint = (
  breakpoint: Breakpoint,
  type: BreakpointType = 'max',
  defaultState: boolean = false
) => useMedia(`(${type}-width: ${breakpoints[breakpoint] - 0.1}px)`, defaultState);

export const useCurrentBreakpoint = (): BreakpointWithDesktopWide => {
  const isMobile = useBreakpoint('mobile');
  const isMobileM = useBreakpoint('mobileM');
  const isTablet = useBreakpoint('tablet');
  const isDesktopS = useBreakpoint('desktop');
  const isDesktopL = useBreakpoint('desktopL');

  if (isMobile) {
    return 'mobile';
  }

  if (isMobileM) {
    return 'mobileM';
  }

  if (isTablet) {
    return 'tablet';
  }

  if (isDesktopS) {
    return 'desktopS';
  }

  if (isDesktopL) {
    return 'desktopL';
  }

  return 'desktop';
};

export const useTablet = (defaultState?: boolean) => useBreakpoint('tablet', 'max', defaultState);
export const useMobile = (defaultState?: boolean) => useBreakpoint('mobile', 'max', defaultState);
export const useMobileM = (defaultState?: boolean) => useBreakpoint('mobileM', 'max', defaultState);
export const useDesktopS = (defaultState?: boolean) =>
  useBreakpoint('desktopS', 'max', defaultState);
export const useDesktopL = (defaultState?: boolean) =>
  useBreakpoint('desktopL', 'max', defaultState);
