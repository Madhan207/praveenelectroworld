import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip px-4 py-3 text-sm">
      {label && <p className="font-bold mb-2" style={{ color: 'var(--admin-text)' }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--admin-text-muted)' }}>{p.name}: </span>
          <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>
            {p.name?.toLowerCase().includes('revenue') || p.name?.toLowerCase().includes('amount')
              ? `₹${Number(p.value).toLocaleString('en-IN')}`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const SalesLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
      <XAxis dataKey="date" tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
      <Area type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} />
      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

export const OrderBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
      <XAxis dataKey="date" tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="orders" name="Orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const StatusDonutChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={240}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={65}
        outerRadius={100}
        paddingAngle={3}
        dataKey="value"
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
    </PieChart>
  </ResponsiveContainer>
);

export const ProductBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
      <XAxis type="number" tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis dataKey="name" type="category" tick={{ fill: 'var(--admin-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="sold" name="Units Sold" fill="#10b981" radius={[0, 6, 6, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const RevenueLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
      <XAxis dataKey="month" tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'var(--admin-text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);
