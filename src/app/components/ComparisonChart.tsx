import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getStoreComparisonData } from '../data/metricsData';

export function ComparisonChart() {
  const data = getStoreComparisonData();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg mb-4">门店维度对比分析</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="store" 
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis 
            yAxisId="left"
            domain={[90, 100]}
            tick={{ fontSize: 12 }}
            stroke="#999"
            label={{ value: '及时率 (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[98, 100]}
            tick={{ fontSize: 12 }}
            stroke="#999"
            label={{ value: '准确率 (%)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
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
          <Bar 
            yAxisId="left"
            dataKey="及时率" 
            fill="#4a90e2" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="right"
            dataKey="准确率" 
            fill="#55e6c1" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
