// next-intl 类型定义
type Messages = typeof import('./src/messages/zh.json');
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare interface IntlMessages extends Messages {}

// 主题偏好类型
interface Window {
  __THEME_PREFERENCE__?: {
    theme: string;
    shouldBeDark: boolean;
  };
}
