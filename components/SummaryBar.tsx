import { Card, Statistic, Row, Col } from 'antd';
import type { PackageData } from '@/types';

interface SummaryBarProps {
  packages: PackageData[];
}

export default function SummaryBar({ packages }: SummaryBarProps) {
  const totals = packages.reduce(
    (acc, pkg) => ({
      daily: acc.daily + pkg.stats.daily,
      weekly: acc.weekly + pkg.stats.weekly,
      monthly: acc.monthly + pkg.stats.monthly,
      allTime: acc.allTime + pkg.stats.allTime,
    }),
    { daily: 0, weekly: 0, monthly: 0, allTime: 0 }
  );

  return (
    <Card className="mb-8 shadow-md bg-gradient-to-r from-red-50 to-orange-50">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Daily Avg"
            value={totals.daily}
            valueStyle={{ color: '#dc2626', fontFamily: 'monospace' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Last Week"
            value={totals.weekly}
            valueStyle={{ color: '#ea580c', fontFamily: 'monospace' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Last Month"
            value={totals.monthly}
            valueStyle={{ color: '#d97706', fontFamily: 'monospace' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="All Time"
            value={totals.allTime}
            valueStyle={{ color: '#059669', fontFamily: 'monospace' }}
          />
        </Col>
      </Row>
    </Card>
  );
}
