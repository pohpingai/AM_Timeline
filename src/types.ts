export type TagType = 'ALL' | 'MY, SG, VN' | 'ID' | 'TH';
export type MarketType = 'ALL' | 'MY' | 'SG' | 'VN' | 'ID' | 'TH';

export interface Task {
  id: string;
  name: string;
  pic: string;
  status: string;
  tag: TagType;
  fcstStart: string; // YYYY-MM-DD
  fcstEnd: string;
  actStart: string;
  actEnd: string;
  color: string;
  group: string;
}
