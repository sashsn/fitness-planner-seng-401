declare module 'web-vitals' {
  export type ReportHandler = (metric: {
    name: string;
    delta: number;
    id: string;
    value?: number;
  }) => void;
  
  export const onCLS: (reportHandler: ReportHandler) => void;
  export const onFID: (reportHandler: ReportHandler) => void;
  export const onFCP: (reportHandler: ReportHandler) => void;
  export const onLCP: (reportHandler: ReportHandler) => void;
  export const onTTFB: (reportHandler: ReportHandler) => void;
}
