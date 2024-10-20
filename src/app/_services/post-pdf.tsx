"use server";

import { revalidatePath } from "next/cache";

export const postPdf = async (formData: FormData) => {
  try {
    const response = await fetch('https://lumi-server.fly.dev/api/upload-pdf', {
    // const response = await fetch('http://localhost:8000/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });
    
    revalidatePath("/library");
    if (response.ok) {
      const data = await response.json();
      console.log('Dados extraídos:', data);
      return { ok: response.ok, ...data };
    } else {
      console.error('Erro ao enviar o PDF');
      return { ok: response.ok, message: 'Erro ao enviar o PDF' };
    }
    
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}