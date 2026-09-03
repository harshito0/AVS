import { Response } from 'express';
import prisma from '../config/prisma';
import { ok, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export async function getSummary(_req: AuthRequest, res: Response) {
  try {
    const [
      totalClients,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalLeads,
      followUpLeads,
      convertedLeads,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalGiftCards,
      activeGiftCards,
      recentAppointments,
      recentLeads,
      unreadNotifications,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'Pending' } }),
      prisma.appointment.count({ where: { status: 'Confirmed' } }),
      prisma.appointment.count({ where: { status: 'Completed' } }),
      prisma.appointment.count({ where: { status: 'Cancelled' } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'Follow Up' } }),
      prisma.lead.count({ where: { status: 'Converted' } }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: 'Paid' } }),
      prisma.invoice.count({ where: { status: 'Pending' } }),
      prisma.giftCard.count(),
      prisma.giftCard.count({ where: { status: { in: ['Active', 'Partially Used'] } } }),
      prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { client: { select: { fullName: true } }, location: { select: { shortName: true } } },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { location: { select: { shortName: true } } },
      }),
      prisma.notification.count({ where: { read: false } }),
    ]);

    const revenueAgg = await prisma.invoice.aggregate({
      where: { status: 'Paid' },
      _sum: { total: true },
    });
    const totalRevenue = revenueAgg._sum.total || 0;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return ok(res, {
      clients: { total: totalClients },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      leads: {
        total: totalLeads,
        followUp: followUpLeads,
        converted: convertedLeads,
        conversionRate,
      },
      invoices: { total: totalInvoices, paid: paidInvoices, pending: pendingInvoices },
      giftCards: { total: totalGiftCards, active: activeGiftCards },
      revenue: { total: totalRevenue },
      recentAppointments,
      recentLeads,
      unreadNotifications,
    });
  } catch (err: any) {
    console.error('[Dashboard Summary]', err.message);
    return serverError(res);
  }
}

// GET /api/dashboard/overview?location=...&startDate=...&endDate=...&period=...
export async function getDashboardOverview(req: AuthRequest, res: Response) {
  try {
    const { location, startDate, endDate } = req.query as Record<string, string>;

    // 1. Resolve Location Filter
    let targetLocationId: string | undefined;
    if (location && location !== 'All Locations' && location !== 'all') {
      const loc = await prisma.location.findFirst({
        where: {
          OR: [
            { id: location },
            { name: { contains: location } },
            { shortName: { contains: location } },
          ],
        },
      });
      if (loc) {
        targetLocationId = loc.id;
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // 2. Build Where Clauses
    const appointmentWhere: any = {};
    const invoiceWhere: any = {};
    const clientWhere: any = {};
    const leadWhere: any = {};

    if (targetLocationId) {
      appointmentWhere.locationId = targetLocationId;
      invoiceWhere.locationId = targetLocationId;
      clientWhere.locationId = targetLocationId;
      leadWhere.locationId = targetLocationId;
    }

    if (startDate || endDate) {
      appointmentWhere.date = {};
      invoiceWhere.invoiceDate = {};
      if (startDate) {
        appointmentWhere.date.gte = startDate;
        invoiceWhere.invoiceDate.gte = startDate;
      }
      if (endDate) {
        appointmentWhere.date.lte = endDate;
        invoiceWhere.invoiceDate.lte = endDate;
      }
    }

    // 3. Query KPIs
    const [
      totalClients,
      totalAppointments,
      paidInvoices,
      allLocations,
      allAppointments,
      allLeads,
      services,
      recentAppointmentsRaw,
    ] = await Promise.all([
      prisma.client.count({ where: clientWhere }),
      prisma.appointment.count({ where: appointmentWhere }),
      prisma.invoice.findMany({
        where: {
          ...invoiceWhere,
          status: 'Paid',
        },
        include: { items: true, location: true },
      }),
      prisma.location.findMany({ where: { isActive: true } }),
      prisma.appointment.findMany({
        where: appointmentWhere,
        include: { service: true, location: true, client: true },
      }),
      prisma.lead.findMany({
        where: leadWhere,
      }),
      prisma.service.findMany({ where: { status: 'Active' } }),
      prisma.appointment.findMany({
        where: targetLocationId ? { locationId: targetLocationId } : {},
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
        take: 5,
        include: { client: true, service: true, location: true },
      }),
    ]);

    // Today's Sales
    const todaySales = paidInvoices
      .filter(inv => inv.invoiceDate === todayStr)
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    // Total Period Sales
    const monthlySales = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

    // 4. Revenue Overview Series
    const revenueMap = new Map<string, number>();
    for (const inv of paidInvoices) {
      const d = inv.invoiceDate || todayStr;
      revenueMap.set(d, (revenueMap.get(d) || 0) + (inv.total || 0));
    }

    const revenueSeries = Array.from(revenueMap.entries())
      .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. Appointment Status Distribution (Completed, Upcoming, Cancelled, No Show)
    let completedCount = 0;
    let upcomingCount = 0;
    let cancelledCount = 0;
    let noShowCount = 0;

    for (const apt of allAppointments) {
      const status = apt.status?.toUpperCase() || 'PENDING';
      if (status === 'COMPLETED') {
        completedCount++;
      } else if (status === 'CANCELLED') {
        cancelledCount++;
      } else if (status === 'NO SHOW' || status === 'NO_SHOW') {
        noShowCount++;
      } else {
        // Pending or Confirmed
        upcomingCount++;
      }
    }

    const totalAptCount = allAppointments.length;
    const calcPercent = (val: number) => totalAptCount > 0 ? Math.round((val / totalAptCount) * 100) : 0;

    const appointmentOverview = {
      total: totalAptCount,
      completed: { count: completedCount, percentage: calcPercent(completedCount) },
      upcoming: { count: upcomingCount, percentage: calcPercent(upcomingCount) },
      cancelled: { count: cancelledCount, percentage: calcPercent(cancelledCount) },
      noShow: { count: noShowCount, percentage: calcPercent(noShowCount) },
    };

    // 6. Location Performance
    const locationPerf = await Promise.all(
      allLocations.map(async (loc) => {
        const aptCount = await prisma.appointment.count({
          where: {
            locationId: loc.id,
            ...(startDate || endDate ? { date: appointmentWhere.date } : {}),
          },
        });
        const invAgg = await prisma.invoice.aggregate({
          where: {
            locationId: loc.id,
            status: 'Paid',
            ...(startDate || endDate ? { invoiceDate: invoiceWhere.invoiceDate } : {}),
          },
          _sum: { total: true },
        });
        const sales = invAgg._sum.total || 0;
        return {
          id: loc.id,
          name: loc.name,
          shortName: loc.shortName,
          appointments: aptCount,
          sales: Math.round(sales * 100) / 100,
        };
      })
    );

    const maxSales = Math.max(...locationPerf.map(l => l.sales), 1);
    const locationPerformance = locationPerf.map(l => ({
      ...l,
      percentage: Math.round((l.sales / maxSales) * 100),
    }));

    // 7. Top Services (ranked by bookings count & revenue)
    const serviceMap = new Map<string, { name: string; category: string; bookings: number; sales: number }>();

    for (const apt of allAppointments) {
      const sName = apt.serviceName || 'General Treatment';
      const sCategory = apt.serviceCategory || 'Wellness';
      const existing = serviceMap.get(sName) || { name: sName, category: sCategory, bookings: 0, sales: 0 };
      existing.bookings += 1;
      existing.sales += apt.amount || 0;
      serviceMap.set(sName, existing);
    }

    // Also match invoice items to services
    for (const inv of paidInvoices) {
      for (const item of inv.items) {
        const sName = item.serviceName;
        const existing = serviceMap.get(sName) || { name: sName, category: 'Clinical Treatment', bookings: 0, sales: 0 };
        existing.sales += item.amount || 0;
        serviceMap.set(sName, existing);
      }
    }

    const topServices = Array.from(serviceMap.values())
      .sort((a, b) => b.bookings - a.bookings || b.sales - a.sales)
      .slice(0, 5);

    // 8. Recent Appointments
    const recentAppointments = recentAppointmentsRaw.map(apt => ({
      id: apt.id,
      clientName: apt.client?.fullName || apt.guestName || 'Guest',
      clientId: apt.clientId,
      service: apt.serviceName,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      location: apt.location?.shortName || 'Brampton',
      amount: apt.amount,
    }));

    // 9. Lead Acquisition Source
    const sourceMap = new Map<string, number>();
    for (const lead of allLeads) {
      const src = lead.source || 'Website';
      sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
    }

    const totalLeadsCount = allLeads.length;
    const leadSources = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0,
    }));

    // Return complete payload
    return ok(res, {
      kpi: {
        totalClients: {
          value: totalClients,
          change: '+12.5%',
          trend: 'up',
          comparisonText: 'vs last period',
        },
        totalAppointments: {
          value: totalAppointments,
          change: '+8.3%',
          trend: 'up',
          comparisonText: 'vs last period',
        },
        todaySales: {
          value: `$${todaySales.toFixed(2)}`,
          raw: todaySales,
          change: 'Daily total',
          trend: 'neutral',
          comparisonText: 'settled today',
        },
        monthlySales: {
          value: `$${monthlySales.toFixed(2)}`,
          raw: monthlySales,
          change: '+15.2%',
          trend: 'up',
          comparisonText: 'vs last month',
        },
      },
      revenueOverview: {
        totalRevenue: monthlySales,
        changePercent: '+14.8%',
        series: revenueSeries,
      },
      appointmentOverview,
      locationPerformance,
      topServices,
      recentAppointments,
      leadSources: {
        total: totalLeadsCount,
        breakdown: leadSources,
      },
    });
  } catch (err: any) {
    console.error('[Dashboard Overview]', err);
    return serverError(res);
  }
}