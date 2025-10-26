import { Textarea } from "@shared/ui/textarea";
import { cn } from "@shared/utils";
import React from "react";
import { useCallback, useEffect, useRef } from "react";

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  minRows?: number;
}

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(({ className, maxRows = 8, minRows = 1, onChange, ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineHeightRef = useRef<number>(0);

  // 获取实际引用
  const getTextarea = useCallback(() => {
    if (ref) {
      if (typeof ref === "function") {
        return textareaRef.current;
      }
      return (ref as React.MutableRefObject<HTMLTextAreaElement>).current;
    }
    return textareaRef.current;
  }, []);

  // 计算行高
  useEffect(() => {
    const textarea = getTextarea();
    if (!textarea) return;

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight);
    lineHeightRef.current = isNaN(lineHeight) ? 20 : lineHeight;
  }, [getTextarea]);

  // 调整高度的函数
  const adjustHeight = useCallback(() => {
    const textarea = getTextarea();
    if (!textarea) return;

    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = "auto";

    // 计算最小和最大高度
    const paddingTop = parseInt(window.getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(window.getComputedStyle(textarea).paddingBottom);
    const minHeight = lineHeightRef.current * minRows + paddingTop + paddingBottom;
    const maxHeight = lineHeightRef.current * maxRows + paddingTop + paddingBottom;

    // 设置新高度
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // 如果内容超出最大高度，显示滚动条
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [getTextarea, minRows, maxRows]);

  // 处理内容变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    adjustHeight();
  };

  // 初始化时调整高度
  useEffect(() => {
    adjustHeight();
  }, [props.value, props.defaultValue, adjustHeight]);

  return (
    <Textarea
      {...props}
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      }}
      onChange={handleChange}
      className={cn(
        "overflow-y-hidden resize-none transition-height duration-100",
        className
      )}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea"; 