import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getTrendData } from '../data/metricsData';

export function TrendChart() {
  const data = getTrendData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg mb-4">时效达标率趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis 
            domain={[90, 100]}
            tick={{ fontSize: 12 }}
            stroke="#999"
            label={{ value: '达标率 (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '目标线 95%', position: 'right', fontSize: 11 }} />
          <Line 
            type="monotone" 
            dataKey="入库时效" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="出库时效" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="通关及时率" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
