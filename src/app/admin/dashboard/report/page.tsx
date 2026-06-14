import { sql } from "@vercel/postgres";

type AdminReportPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
};

type RevenueRow = {
  product_type: "component" | "monitor" | "pc";
  revenue_vnd: number | string | null;
};

type RevenueItem = {
  label: string;
  revenue: number;
  type: "component" | "monitor" | "pc";
};

const reportTypes: RevenueItem[] = [
  {
    label: "PC",
    revenue: 0,
    type: "pc",
  },
  {
    label: "Linh kiện",
    revenue: 0,
    type: "component",
  },
  {
    label: "Màn hình",
    revenue: 0,
    type: "monitor",
  },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN");

export default async function AdminReportPage({
  searchParams,
}: AdminReportPageProps) {
  const { from, to } = await searchParams;
  const dateRange = getDateRange(from, to);
  const reportItems = await fetchRevenueReport(dateRange.from, dateRange.to);
  const totalRevenue = reportItems.reduce((total, item) => total + item.revenue, 0);
  const maxRevenue = Math.max(...reportItems.map((item) => item.revenue), 1);

  return (
    <div className="admin-report-page">
      <div>
        <p>Xem báo cáo</p>
        <h1>Doanh thu theo loại sản phẩm</h1>
      </div>

      <form className="admin-report-filter">
        <label>
          Từ ngày
          <input name="from" type="date" defaultValue={dateRange.from} />
        </label>
        <label>
          Đến ngày
          <input name="to" type="date" defaultValue={dateRange.to} />
        </label>
        <button className="admin-create-button" type="submit">
          Xem báo cáo
        </button>
      </form>

      <section className="admin-report-summary">
        <span>Tổng doanh thu</span>
        <strong>{formatVnd(totalRevenue)}</strong>
      </section>

      <section className="admin-revenue-chart" aria-label="Biểu đồ doanh thu">
        <div className="admin-chart-axis">
          <span>{formatCompactVnd(maxRevenue)}</span>
          <span>{formatCompactVnd(Math.round(maxRevenue / 2))}</span>
          <span>0</span>
        </div>

        <div className="admin-chart-bars">
          {reportItems.map((item) => {
            const height = Math.max(4, Math.round((item.revenue / maxRevenue) * 100));

            return (
              <div className="admin-chart-column" key={item.type}>
                <div className="admin-chart-track">
                  <span
                    className={`admin-chart-bar admin-chart-bar--${item.type}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <strong>{formatVnd(item.revenue)}</strong>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <table className="admin-report-table">
        <thead>
          <tr>
            <th>Loại sản phẩm</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {reportItems.map((item) => (
            <tr key={item.type}>
              <td>{item.label}</td>
              <td>{formatVnd(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function fetchRevenueReport(from: string, to: string) {
  const { rows } = await sql<RevenueRow>`
    SELECT
      CASE invoice_details.item_type
        WHEN 'product' THEN 'pc'
        WHEN 'component' THEN 'component'
        WHEN 'monitor' THEN 'monitor'
      END AS product_type,
      COALESCE(SUM(invoice_details.line_total_vnd), 0) AS revenue_vnd
    FROM invoices
    INNER JOIN invoice_details
      ON invoice_details.invoice_id = invoices.id
    WHERE invoices.created_at >= ${from}::date
      AND invoices.created_at < (${to}::date + INTERVAL '1 day')
      AND invoice_details.item_type IN ('product', 'component', 'monitor')
    GROUP BY product_type;
  `;
  const revenueByType = new Map(
    rows.map((row) => [row.product_type, Number(row.revenue_vnd ?? 0)]),
  );

  return reportTypes.map((item) => ({
    ...item,
    revenue: revenueByType.get(item.type) ?? 0,
  }));
}

function getDateRange(
  from?: string,
  to?: string,
): {
  from: string;
  to: string;
} {
  const today = new Date();
  const defaultTo = formatDateInput(today);
  const defaultFrom = formatDateInput(addDays(today, -30));
  const validFrom = isDateInput(from) ? String(from) : defaultFrom;
  const validTo = isDateInput(to) ? String(to) : defaultTo;

  if (validFrom > validTo) {
    return {
      from: validTo,
      to: validFrom,
    };
  }

  return {
    from: validFrom,
    to: validTo,
  };
}

function isDateInput(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatVnd(value: number) {
  return `${currencyFormatter.format(value)} VND`;
}

function formatCompactVnd(value: number) {
  if (value >= 1_000_000_000) {
    return `${currencyFormatter.format(Math.round(value / 1_000_000_000))} tỷ`;
  }

  if (value >= 1_000_000) {
    return `${currencyFormatter.format(Math.round(value / 1_000_000))} triệu`;
  }

  return currencyFormatter.format(value);
}
