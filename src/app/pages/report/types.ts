export interface StatItem {
  label: string;
  value: string;
}

export interface ReportSectionData {
  title: string;
  imageSrc?: string;
  icon?: React.ReactNode;
  stats: StatItem[];
}
