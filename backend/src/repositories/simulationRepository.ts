import { supabase } from '../config/supabase';
import { Simulacao } from '../types';

export class SimulationRepository {
  async findAll(userId: string) {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data as Simulacao[];
  }

  async create(userId: string, simulacao: Omit<Simulacao, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('simulacoes')
      .insert({ ...simulacao, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Simulacao;
  }

  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('simulacoes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}
