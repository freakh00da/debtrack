import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer} from 'recharts';
import Title from './title';
import {DataMto} from '../data/mto';
import {useAuth} from '../context/AuthContext';

// Generate Sales Data
function createData(data) {
  return data.map((item) => ({
    time: new Date(item.date).toDateString(),
    amount: item.amount,
  }));
}

export default function Chart() {
  const [loading, setLoading] = React.useState(true);
  const [dataMto, setDataMto] = React.useState([]);
  const theme = useTheme();
  const {user} = useAuth();
  const uid = user.uid;
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DataMto(uid);
        setDataMto(data);
        setLoading(false);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    };

    fetchData();
  }, [uid]);

  const chartData = createData(dataMto);

  const formatXAxis = (tickItem) => {
    // Mengambil bulan dan tanggal dari format "DD MMM, YYYY"
    const [dayMonth] = tickItem.split(',');
    return dayMonth;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Title>Minggu ini</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} style={theme.typography.body2} tickFormatter={formatXAxis} />
          <YAxis stroke={theme.palette.text.secondary} style={theme.typography.body2}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Hutang (Rp)
            </Label>
          </YAxis>
          <Line isAnimationActive={false} type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
