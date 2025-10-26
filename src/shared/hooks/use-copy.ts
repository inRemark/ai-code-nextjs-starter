import { useCallback } from "react";

interface UseCopyOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onFinish?: () => void;
}

export function useCopy(options: UseCopyOptions = {}) {
  const { onSuccess, onError, onFinish } = options;

  const copy = useCallback(async (text: string) => {
    // 在服务端渲染时直接返回 false
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      onError?.(new Error("Clipboard API not available in server environment"));
      return false;
    }
    
    try {
      // 首先尝试使用现代 API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级方案：使用传统的 execCommand
        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback copy failed:", err);
          throw new Error("Copy failed");
        } finally {
          textArea.remove();
        }
      }

      onSuccess?.();
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    } finally {
      onFinish?.();
    }
  }, [onSuccess, onError, onFinish]);

  return {
    copy,
  };
}