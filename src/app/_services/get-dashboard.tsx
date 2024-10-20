"use server";

import { revalidatePath } from "next/cache";

export const getDashboard = async () => {
  try {
    const response = await fetch(process.env.API_URL + '/api/dashboard');

    if (!response.ok) {
      throw new Error('Erro ao buscar o dashboard');
    }

    const data = await response.json();
    revalidatePath("/library");
    return data;
  } catch (error) {
    console.error('Erro ao buscar o dashboard:', error);
    throw error;
  }
}