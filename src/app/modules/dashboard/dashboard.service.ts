import { prisma } from '../../config/prisma';

interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  companyType?: string;
  businessType?: string;
}

export const dashboardService = {
  async getSummary(filters: DashboardFilters) {
    const transactionWhere: any = {};

    if (filters.startDate || filters.endDate) {
      transactionWhere.createdAt = {};
      if (filters.startDate) transactionWhere.createdAt.gte = filters.startDate;
      if (filters.endDate) transactionWhere.createdAt.lte = filters.endDate;
    }

    const hotelWhere: any = {};
    if (filters.companyType) {
      hotelWhere.companyType = filters.companyType;
    }
    if (filters.businessType) {
      hotelWhere.businessType = filters.businessType;
    }

    const [totalRevenue, totalTransactions, revenueByStatus, hotels] =
      await Promise.all([
        prisma.transaction.aggregate({
          where: transactionWhere,
          _sum: { amount: true },
        }),
        prisma.transaction.count({ where: transactionWhere }),
        prisma.transaction.groupBy({
          by: ['status'],
          where: transactionWhere,
          _sum: { amount: true },
          _count: true,
        }),
        prisma.hotel.findMany({
          where: hotelWhere,
          include: {
            transactions: {
              where: transactionWhere,
            },
          },
        }),
      ]);

    const top5Hotels = hotels
      .map((hotel: any) => ({
        id: hotel.id,
        name: hotel.name,
        revenue: hotel.transactions
          ? hotel.transactions.reduce(
              (sum: number, t: any) => sum + Number(t.amount),
              0
            )
          : 0,
      }))
      .filter((hotel: any) => hotel.revenue > 0)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue: totalRevenue._sum.amount?.toString() || '0',
      totalTransactions,
      revenueByStatus: revenueByStatus.map((s: any) => ({
        status: s.status,
        revenue: s._sum.amount?.toString() || '0',
        count: s._count,
      })),
      top5Hotels,
    };
  },
};
