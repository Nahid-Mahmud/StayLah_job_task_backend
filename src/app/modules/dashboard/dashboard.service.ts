import { BusinessType, CompanyType, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  companyType?: string;
  businessType?: string;
}

interface DashboardSummary {
  totalRevenue: string;
  totalTransactions: number;
  revenueByStatus: {
    status: string;
    revenue: string;
    count: number;
  }[];
  top5Hotels: {
    id: string;
    name: string;
    revenue: string;
  }[];
}

const isCompanyType = (value: string): value is CompanyType =>
  Object.values(CompanyType).includes(value as CompanyType);

const isBusinessType = (value: string): value is BusinessType =>
  Object.values(BusinessType).includes(value as BusinessType);

export const dashboardService = {
  async getSummary(filters: DashboardFilters): Promise<DashboardSummary> {
    const { startDate, endDate, companyType, businessType } = filters;
    const companyTypeFilter =
      companyType && isCompanyType(companyType) ? companyType : undefined;
    const businessTypeFilter =
      businessType && isBusinessType(businessType) ? businessType : undefined;

    // Base conditions for transactions
    const transactionConditions: Prisma.TransactionWhereInput = {};
    if (startDate || endDate) {
      transactionConditions.createdAt = {};
      if (startDate) transactionConditions.createdAt.gte = startDate;
      if (endDate) transactionConditions.createdAt.lte = endDate;
    }

    // Join conditions for hotels
    if (companyTypeFilter || businessTypeFilter) {
      transactionConditions.hotel = {};
      if (companyTypeFilter)
        transactionConditions.hotel.companyType = companyTypeFilter;
      if (businessTypeFilter)
        transactionConditions.hotel.businessType = businessTypeFilter;
    }

    const [totalRevenueAgg, totalTransactions, revenueByStatusAgg] =
      await Promise.all([
        prisma.transaction.aggregate({
          where: transactionConditions,
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: transactionConditions,
        }),
        prisma.transaction.groupBy({
          by: ['status'],
          where: transactionConditions,
          _sum: { amount: true },
          _count: true,
        }),
      ]);

    // Top 5 hotels by revenue using optimized raw SQL aggregation for perfect performance
    const top5Hotels: { id: string; name: string; revenue: string }[] =
      await prisma.$queryRaw`
      SELECT h.id, h.name, SUM(t.amount)::TEXT as revenue
      FROM "Hotel" h
      JOIN "Transaction" t ON h.id = t."hotelId"
      WHERE t.status = 'success'
      ${startDate ? Prisma.sql`AND t."createdAt" >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND t."createdAt" <= ${endDate}` : Prisma.empty}
      ${companyTypeFilter ? Prisma.sql`AND h."companyType" = ${companyTypeFilter}::"CompanyType"` : Prisma.empty}
      ${businessTypeFilter ? Prisma.sql`AND h."businessType" = ${businessTypeFilter}::"BusinessType"` : Prisma.empty}
      GROUP BY h.id, h.name
      ORDER BY SUM(t.amount) DESC
      LIMIT 5
    `;

    return {
      totalRevenue: totalRevenueAgg._sum.amount?.toString() || '0',
      totalTransactions,
      revenueByStatus: revenueByStatusAgg.map((s) => ({
        status: s.status,
        revenue: s._sum.amount?.toString() || '0',
        count: s._count,
      })),
      top5Hotels,
    };
  },
};
