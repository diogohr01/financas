import { supabase } from '../config/supabase';
import { Receita } from '../types';

export class RevenueRepository {
  async findAll(userId: string, filters?: { categoria?: string; tipo?: string; data_inicio?: string; data_fim?: string }) {
    let query = supabase
      .from('receitas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (filters?.categoria) query = query.eq('categoria', filters.categoria);
    if (filters?.tipo) query = query.eq('tipo', filters.tipo);
    if (filters?.data_inicio) query = query.gte('data', filters.data_inicio);
    if (filters?.data_fim) query = query.lte('data', filters.data_fim);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Receita[];
  }

  async findById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('receitas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data as Receita;
  }

  async create(userId: string, receita: Omit<Receita, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('receitas')
      .insert({ ...receita, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Receita;
  }

  async update(id: string, userId: string, receita: Partial<Receita>) {
    const { data, error } = await supabase
      .from('receitas')
      .update(receita)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Receita;
  }

  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('receitas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  async sumByMonth(userId: string, year: number) {
    const { data, error } = await supabase
      .from('receitas')
      .select('data, valor')
      .eq('user_id', userId)
      .gte('data', `${year}-01-01`)
      .lte('data', `${year}-12-31`);
    if (error) throw new Error(error.message);
    return data as { data: string; valor: number }[];
  }
}
