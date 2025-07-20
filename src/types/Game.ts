

export type Game = {
  id: number;
  name: string;
  rtp: number;
  volatility: 'low' | 'medium' | 'high';
  volatility_tier?: number;
  simulated?: number;
  prev_win_rate?: number;
  bonus_rate?: number;
  free_spin_rate?: number;
  user_count?: number;
  avg_bet?: number;
  total_payout?: number;
  last_simulated_at?: string;
  image: string; 
};
