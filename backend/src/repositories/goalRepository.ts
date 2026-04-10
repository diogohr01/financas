import { supabase } from '../config/supabase';
import { Meta } from '../types';

export class GoalRepository {
  async findAll(userId: string) {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', userId)
      .order('prazo', { ascending: true });
    if (error) throw new Error(error.message);
    return data as Meta[];
  }

  async findById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (error) throw new Error(error.message);
    return data as Meta;
  }

  async create(userId: string, meta: Omit<Meta, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('metas')
      .insert({ ...meta, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Meta;
  }

  async update(id: string, userId: string, meta: Partial<Meta>) {
    const { data, error } = await supabase
      .from('metas')
      .update(meta)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Meta;
  }

  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('metas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  }
}
