import { supabase } from '../config/supabase';
import { Previsao } from '../types';

export class PredictionRepository {
  async findAll(userId: string) {
    const { data, error } = await supabase
      .from('previsoes')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data as Previsao[];
  }

  async create(userId: string, previsao: Omit<Previsao, 'id' | 'user_id' | 'data'>) {
    const { data, error } = await supabase
      .from('previsoes')
      .insert({ ...previsao, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Previsao;
  }

  async deleteAll(userId: string) {
    const { error } = await supabase
      .from('previsoes')
      .delete()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}
