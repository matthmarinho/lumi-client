"use server";

import { revalidatePath } from "next/cache";

export const getLibrary = async () => {
  try {
    const response = await fetch('https://lumi-server.fly.dev/api/library');

    if (!response.ok) {
      throw new Error('Erro ao buscar as faturas de energia');
    }

    const data = await response.json();
    revalidatePath("/library");
    return data;
  } catch (error) {
    console.error('Erro ao buscar as faturas de energia:', error);
    throw error;
  }
}