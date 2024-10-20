"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table"
import { getLibrary } from "../_services/get-library"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "../_components/ui/card";
import { Label } from "../_components/ui/label";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { cn } from "../_lib/utils";
import { postPdf } from "../_services/post-pdf";
import { FileIcon, FileUpIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { toast } from "sonner";

const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

interface EnergyInvoice {
  customerName: string;
  customerNumber: string;
  referenceYear: string;
  pdfFiles: [{
    referenceMonth: string;
    pdfFile: {
      data: Buffer
    };
  }]
}

export default function Library() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [energyInvoices, setEnergyInvoices] = useState<EnergyInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<EnergyInvoice[]>([]);
  const [customerNumbers, setCustomerNumbers] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Todos os Clientes');
  const [selectedYear, setSelectedYear] = useState<string>('Todos os Anos');
  const [sending, setSending] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const filterByCustomer = (value: string) => {
    setSelectedCustomer(value)
    const filtered = energyInvoices.filter(k => k.customerNumber === value);
    setFilteredInvoices(filtered.length > 0 ? filtered : energyInvoices);
  };

  const filterByYear = (value: string) => {
    setSelectedYear(value)
    const filtered = energyInvoices.filter(k => k.referenceYear === value);
    setFilteredInvoices(filtered.length > 0 ? filtered : energyInvoices);
  };

  const clearFilters = () => {
    setFilteredInvoices(energyInvoices);
    setSelectedCustomer('Todos os Clientes')
    setSelectedYear('Todos os Anos')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true)

    if (!selectedFile) {
      toast.warning('Por favor, selecione um arquivo PDF.');
      setSending(false)
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    setSelectedFile(null)

    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }

    const response = await postPdf(formData)

    if (response.ok) {
      toast.success(response.message);
      loadEnergyInvoices()
    } else {
      toast.error(response.message);
    }
    setSending(false)
  };

  const loadEnergyInvoices = async () => {
    const response = await getLibrary();
    setEnergyInvoices(response.data.invoices || []);
    setFilteredInvoices(response.data.invoices || []);
    setCustomerNumbers(response.data.customerNumbers || []);
    setYears(response.data.years || []);
    setLoading(false);
  };

  useEffect(() => {
    loadEnergyInvoices();
  }, []);

  const convertBufferToBase64 = (buffer: Buffer) => {
    return Buffer.from(buffer).toString('base64');
  };

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
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Biblioteca de Faturas</h2>
        </div>
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1 items-center">
                <FileUpIcon className="h-5 w-5" />
                <Label htmlFor="file-upload" className="font-semibold">Enviar Conta de Energia</Label>
              </div>
              <div className="flex flex-row gap-1">
                <Input id="invoice" ref={inputFile} type="file" accept="application/pdf" onChange={handleFileChange} disabled={sending} />
                <Button type="submit" disabled={sending}>Enviar</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div className="pb-4 flex flex-row gap-2">
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

          <Button onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Número</TableHead>
                  {months.map((month: string) => (
                    <TableHead key={month} >{month}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice: EnergyInvoice) => (
                  <TableRow key={invoice.customerNumber}>
                    <TableCell className="font-medium">{invoice.customerName}</TableCell>
                    <TableCell>{invoice.customerNumber}</TableCell>
                    {months.map((month) => {
                      const pdf = invoice.pdfFiles.find((pdf: {
                        referenceMonth: string;
                        pdfFile: {
                          data: Buffer
                        }
                      }
                      ) => pdf.referenceMonth.split('/')[0] === month);
                      return (
                        <TableCell key={month} className="font-medium">
                          {pdf ? (
                            <a
                              href={`data:application/pdf;base64,${convertBufferToBase64(pdf.pdfFile.data)}`}
                              download={`${pdf.referenceMonth}.pdf`}
                              className="flex items-center space-x-2"
                            >
                              <FileIcon className="h-5 w-5" />
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}