"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../_components/ui/card"
import { useEffect, useState } from "react"
import { cn } from "../_lib/utils"
import { getDashboard } from "../_services/get-dashboard"
import { DollarSignIcon, HandCoinsIcon, PlugZapIcon, ZapIcon } from "lucide-react"
import EnergyResultsChart from "../_components/energy-results-chart"
import FinancialResultsChart from "../_components/financial-results-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select"
import { Button } from "../_components/ui/button"

interface InputData {
  customerNumber: string;
  referenceMonth: string;
  referenceYear: string;
  electricEnergyConsumption: number;
  compensatedEnergy: number;
  totalValueWithoutGD: number;
  GDSavings: number;
}

interface FormattedData {
  labels: string[];
  electricEnergyConsumption: number[];
  compensatedEnergy: number[];
  totalValueWithoutGD: number[];
  GDSavings: number[];
}

interface FormattedDashboard {
  electricEnergyConsumption: number;
  compensatedEnergy: number;
  totalValueWithoutGD: number;
  GDSavings: number;
}

const monthsOrder = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboard, setDashboard] = useState<InputData[]>([]);
  const [charts, setCharts] = useState<InputData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Todos os Clientes');
  const [selectedYear, setSelectedYear] = useState<string>('Todos os Anos');
  const [filteredDashboard, setFilteredDashboard] = useState<FormattedDashboard>({
    electricEnergyConsumption: 0,
    compensatedEnergy: 0,
    totalValueWithoutGD: 0,
    GDSavings: 0,
  });
  const [filteredCharts, setFilteredCharts] = useState<FormattedData>({
    labels: [],
    electricEnergyConsumption: [],
    compensatedEnergy: [],
    totalValueWithoutGD: [],
    GDSavings: [],
  });
  const [customerNumbers, setCustomerNumbers] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const filterByCustomer = (value: string) => {
    setSelectedCustomer(value)
    const filtered = dashboard.filter((k) => k.customerNumber === value)
    const dashboardFiltered = formatDashboard(filtered)
    const chartFiltered = formatCharts(filtered)
    setFilteredDashboard(filtered.length > 0 ? dashboardFiltered : formatDashboard(dashboard))
    setFilteredCharts(filtered.length > 0 ? chartFiltered : formatCharts(charts))
  };

  const filterByYear = (value: string) => {
    setSelectedYear(value)
    const filtered = charts.filter((k) => k.referenceYear === value)
    const dashboardFiltered = formatDashboard(filtered)
    const chartFiltered = formatCharts(filtered)
    setFilteredDashboard(filtered.length > 0 ? dashboardFiltered : formatDashboard(dashboard))
    setFilteredCharts(filtered.length > 0 ? chartFiltered : formatCharts(charts))
  };

  const clearFilters = () => {
    setFilteredCharts(formatCharts(charts))
    setFilteredDashboard(formatDashboard(dashboard))
    setSelectedCustomer('Todos os Clientes')
    setSelectedYear('Todos os Anos')
  }

  const formatDashboard = (data: InputData[]) => {
    const total = data.reduce((acc, item) => {
      acc.electricEnergyConsumption += item.electricEnergyConsumption;
      acc.compensatedEnergy += item.compensatedEnergy;
      acc.totalValueWithoutGD += item.totalValueWithoutGD;
      acc.GDSavings += item.GDSavings;
      return acc;
    }, {
      electricEnergyConsumption: 0,
      compensatedEnergy: 0,
      totalValueWithoutGD: 0,
      GDSavings: 0,
    });

    return total
  }

  const formatCharts = (data: InputData[]) => {
    const sortedData = data.sort((a, b) => {
      const yearComparison = a.referenceYear.localeCompare(b.referenceYear);
      if (yearComparison !== 0) return yearComparison;
      return monthsOrder.indexOf(a.referenceMonth) - monthsOrder.indexOf(b.referenceMonth);
    });

    const formattedData: FormattedData = {
      labels: [],
      electricEnergyConsumption: [],
      compensatedEnergy: [],
      totalValueWithoutGD: [],
      GDSavings: [],
    };

    sortedData.forEach((item) => {
      formattedData.labels.push(`${item.referenceMonth}/${item.referenceYear}`);
      formattedData.electricEnergyConsumption.push(item.electricEnergyConsumption);
      formattedData.compensatedEnergy.push(item.compensatedEnergy);
      formattedData.totalValueWithoutGD.push(item.totalValueWithoutGD);
      formattedData.GDSavings.push(item.GDSavings);
    });

    return formattedData
  };

  const currencyFormat = (num: string) => {
    return 'R$ ' + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  useEffect(() => {
    const loadEnergyInvoices = async () => {
      const response = await getDashboard();
      setDashboard(response.data.dashboard)
      setCharts(response.data.dashboard)
      const formattedDashboard = formatDashboard(response.data.dashboard)
      const formattedCharts = formatCharts(response.data.dashboard)
      setFilteredDashboard(formattedDashboard)
      setFilteredCharts(formattedCharts)
      setCustomerNumbers(response.data.customerNumbers || []);
      setYears(response.data.years || []);
      setLoading(false);
    };

    loadEnergyInvoices();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin")}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex flex-row gap-2">
                <Select value={selectedCustomer} onValueChange={filterByCustomer}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Número do Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="Todos os Clientes" value="Todos os Clientes" >Todos os Clientes</SelectItem>
                    {customerNumbers.map((customer: string) => (
                      <SelectItem key={customer} value={customer} >{customer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={filterByYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="Todos os Anos" value="Todos os Anos" >Todos os Anos</SelectItem>
                    {years.map((year: string) => (
                      <SelectItem key={year} value={year} >{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-[180px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM/yyyy", { locale: ptBR }).toUpperCase() : <p>Mês</p>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
            </PopoverContent>
          </Popover> */}

                <Button onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Consumo de Energia Elétrica
                  </CardTitle>
                  <ZapIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredDashboard.electricEnergyConsumption.toFixed(2)} KWh</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Energia Compensada
                  </CardTitle>
                  <PlugZapIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredDashboard.compensatedEnergy.toFixed(2)} KWh</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total sem GD</CardTitle>
                  <DollarSignIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currencyFormat(filteredDashboard.totalValueWithoutGD.toString())}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Economia GD
                  </CardTitle>
                  <HandCoinsIcon className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currencyFormat(filteredDashboard.GDSavings.toString())}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Resultados de Energia (KWh)</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex items-center justify-center">
                  <EnergyResultsChart data={{
                    labels: filteredCharts.labels,
                    electricEnergyConsumption: filteredCharts.electricEnergyConsumption,
                    compensatedEnergy: filteredCharts.compensatedEnergy
                  }} />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Resultados Financeiros (R$)</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex items-center justify-center">
                  <FinancialResultsChart data={{
                    labels: filteredCharts.labels,
                    totalValueWithoutGD: filteredCharts.totalValueWithoutGD,
                    GDSavings: filteredCharts.GDSavings
                  }} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}