import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FinancialResultsProps {
  data: {
    totalValueWithoutGD: number[];
    GDSavings: number[];
    labels: string[];
  };
}

export default function FinancialResultsChart({ data }: FinancialResultsProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Valor Total sem GD (R$)',
        data: data.totalValueWithoutGD,
        backgroundColor: '#00992d',
      },
      {
        label: 'Economia GD (R$)',
        data: data.GDSavings,
        backgroundColor: '#006900',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false, text: 'Resultados Financeiros (R$)' },
    },
  };

  return <Bar options={options} data={chartData} />;
}