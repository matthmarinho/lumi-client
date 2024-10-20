"use server";

import { revalidatePath } from "next/cache";

export const getDashboard = async () => {
  try {
    const response = await fetch('https://lumi-server.fly.dev/api/dashboard');
    // const response = await fetch('http://localhost:8000/api/dashboard');

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