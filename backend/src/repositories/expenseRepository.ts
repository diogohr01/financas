import { supabase } from '../config/supabase';
import { Despesa } from '../types';

export class ExpenseRepository {
  async findAll(userId: string, filters?: { categoria?: string; tipo?: string; data_inicio?: string; data_fim?: string }) {
    let query = supabase
      .from('despesas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (filters?.categoria) query = query.eq('categoria', filters.categoria);
    if (filters?.tipo) query = query.eq('tipo', filters.tipo);
    if (filters?.data_inicio) query = query.gte('data', filters.data_inicio);
    if (filters?.data_fim) query = query.lte('data', filters.data_fim);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Despesa[];
  }

  async findById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data as Despesa;
  }

  async create(userId: string, despesa: Omit<Despesa, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('despesas')
      .insert({ ...despesa, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Despesa;
  }

  async update(id: string, userId: string, despesa: Partial<Despesa>) {
    const { data, error } = await supabase
      .from('despesas')
      .update(despesa)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Despesa;
  }

  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('despesas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  async sumByMonth(userId: string, year: number) {
    const { data, error } = await supabase
      .from('despesas')
      .select('data, valor, categoria')
      .eq('user_id', userId)
      .gte('data', `${year}-01-01`)
      .lte('data', `${year}-12-31`);
    if (error) throw new Error(error.message);
    return data as { data: string; valor: number; categoria: string }[];
  }
}
