export interface FacebookStatus {
  created_time: string;
  id: string;
  type: string;
  link: string;
  message: string;
  reactions: {
    summary: {
      total_count: number;
    };
  };
}
