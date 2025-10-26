import { useCallback, useEffect, useState } from 'react';

interface ViewportState {
  height: number;
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

export function useViewportHeight(): ViewportState {
  const [state, setState] = useState<ViewportState>(() => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isKeyboardVisible: false,
    keyboardHeight: 0
  }));

  // 在服务端渲染时提供默认值
  const isMobile = typeof navigator !== 'undefined' 
    ? /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent) 
    : false;
  const isIOS = typeof navigator !== 'undefined' 
    ? /iPad|iPhone|iPod/.test(navigator.userAgent) 
    : false;
  const isAndroid = typeof navigator !== 'undefined' 
    ? /Android/i.test(navigator.userAgent) 
    : false;
  
  const getVisibleHeight = useCallback((): number => {
    if (typeof window === 'undefined') {
      return 0;
    }
    
    if (window.visualViewport) {
      return window.visualViewport.height;
    }
    return window.innerHeight;
  }, []);

  const updateViewportState = useCallback(() => {
    // 如果 window 不存在，直接返回
    if (typeof window === 'undefined') {
      return;
    }
    
    if (!isMobile) {
      setState({
        height: window.innerHeight,
        isKeyboardVisible: false,
        keyboardHeight: 0
      });
      return;
    }

    const currentHeight = getVisibleHeight();
    const maxHeight = Math.max(window.innerHeight, currentHeight);
    const heightDiff = maxHeight - currentHeight;
    
    // 调整键盘检测阈值
    const keyboardThreshold = isAndroid ? maxHeight * 0.15 : maxHeight * 0.25;
    const isKeyboardVisible = heightDiff > keyboardThreshold;

    // 防止 Android Chrome 软键盘收起时的抽屉问题
    if (isAndroid && !isKeyboardVisible) {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.minHeight = '100%';
      
      // 强制重排
      requestAnimationFrame(() => {
        document.documentElement.style.height = '';
        document.body.style.height = '';
        document.body.style.minHeight = '';
      });
    }

    setState({
      height: currentHeight,
      isKeyboardVisible,
      keyboardHeight: isKeyboardVisible ? heightDiff : 0
    });
  }, [getVisibleHeight, isAndroid, isMobile]);

  useEffect(() => {
    // 如果 window 不存在，直接返回
    if (typeof window === 'undefined') {
      return;
    }
    
    const handleResize = () => {
      // 使用 requestAnimationFrame 来确保视口更新的平滑性
      requestAnimationFrame(() => {
        setState({
          height: window.innerHeight,
          isKeyboardVisible: false,
          keyboardHeight: 0
        });
      });
    };

    window.addEventListener("resize", handleResize);
    // 初始化时立即执行一次
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 如果 window 不存在，直接返回
    if (typeof window === 'undefined') {
      return;
    }
    
    if (!isMobile) {
      window.addEventListener('resize', updateViewportState);
      return () => window.removeEventListener('resize', updateViewportState);
    }

    const cleanup: (() => void)[] = [];

    if (window.visualViewport) {
      const handleViewportChange = () => {
        requestAnimationFrame(updateViewportState);
      };

      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);

      cleanup.push(() => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
        window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      });
    }

    if (isIOS) {
      const handleFocusIn = () => {
        setTimeout(updateViewportState, 300);
      };

      const handleFocusOut = () => {
        setTimeout(updateViewportState, 100);
      };

      window.addEventListener('focusin', handleFocusIn);
      window.addEventListener('focusout', handleFocusOut);

      cleanup.push(() => {
        window.removeEventListener('focusin', handleFocusIn);
        window.removeEventListener('focusout', handleFocusOut);
      });
    }

    if (!isIOS && isMobile) {
      const handleResize = () => {
        requestAnimationFrame(updateViewportState);
      };

      window.addEventListener('resize', handleResize);
      cleanup.push(() => window.removeEventListener('resize', handleResize));
    }

    const handleOrientationChange = () => {
      setTimeout(updateViewportState, 150);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    cleanup.push(() => window.removeEventListener('orientationchange', handleOrientationChange));

    updateViewportState();

    return () => cleanup.forEach(fn => fn());
  }, [isMobile, isIOS, updateViewportState]);

  return state;
} 