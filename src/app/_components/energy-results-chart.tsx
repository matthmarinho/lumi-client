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

interface EnergyResultsProps {
  data: {
    electricEnergyConsumption: number[];
    compensatedEnergy: number[];
    labels: string[];
  };
}

export default function EnergyResultsChart({ data }: EnergyResultsProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Consumo de Energia Elétrica (KWh)',
        data: data.electricEnergyConsumption,
        backgroundColor: '#00ff89',
      },
      {
        label: 'Energia Compensada (KWh)',
        data: data.compensatedEnergy,
        backgroundColor: '#00cb5b',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false, text: 'Resultados de Energia (KWh)' },
    },
  };

  return <Bar options={options} data={chartData} />;
}