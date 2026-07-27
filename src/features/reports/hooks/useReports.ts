import { useQuery } from '@tanstack/react-query';
import { ReportService } from '../services/ReportService';
import type { ProductType } from '@/features/products/types';

const REPORTS_KEY = 'reports';

export function useReportByType(type: ProductType | null) {
  return useQuery({
    queryKey: [REPORTS_KEY, 'by-type', type],
    queryFn: () => ReportService.byType(type!),
    enabled: !!type,
  });
}

export function useProfitReport() {
  return useQuery({
    queryKey: [REPORTS_KEY, 'profit'],
    queryFn: ReportService.profit,
  });
}
