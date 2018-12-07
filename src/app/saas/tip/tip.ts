export class Tip {
  type: string;
  title: string;
  content: string;
  onOk?: (data?: any) => {};
  onCancel?: (data?: any) => {};
}
