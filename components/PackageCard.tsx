import { useState } from 'react';
import { Card, Statistic, Row, Col, Segmented } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { PackageData, TimeRange } from '@/types';

interface PackageCardProps {
  package: PackageData;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');

  const getChartData = () => {
    const days = parseInt(timeRange);
    return pkg.stats.downloads.slice(-days);
  };

  const chartData = getChartData();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 font-mono mb-1">
          {pkg.name}
        </h3>
        <p className="text-sm text-gray-500 mb-1">v{pkg.version}</p>
        <p className="text-sm text-gray-600">{pkg.description}</p>
      </div>

      <Row gutter={[12, 12]} className="mb-6">
        <Col span={12}>
          <Statistic
            title="Daily Avg"
            value={pkg.stats.daily}
            valueStyle={{ fontSize: '1.25rem', fontFamily: 'monospace' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Last Week"
            value={pkg.stats.weekly}
            valueStyle={{ fontSize: '1.25rem', fontFamily: 'monospace' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Last Month"
            value={pkg.stats.monthly}
            valueStyle={{ fontSize: '1.25rem', fontFamily: 'monospace' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="All Time"
            value={pkg.stats.allTime}
            valueStyle={{ fontSize: '1.25rem', fontFamily: 'monospace' }}
          />
        </Col>
      </Row>

      <div className="mb-3">
        <Segmented
          options={[
            { label: '7 Days', value: '7' },
            { label: '30 Days', value: '30' },
            { label: '90 Days', value: '90' },
            { label: '1 Year', value: '365' },
          ]}
          value={timeRange}
          onChange={(value) => setTimeRange(value as TimeRange)}
          block
        />
      </div>

      <div className="h-48">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number | undefined) => value !== undefined ? [value, 'Downloads'] : ['0', 'Downloads']}
              />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No download data available
          </div>
        )}
      </div>
    </Card>
  );
}
