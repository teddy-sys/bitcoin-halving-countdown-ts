import axios from 'axios';

export const getBlockCount = async (): Promise<number> => {
  try {
    const res = await axios.get<{ result: number }>('/api/getblockcount');
    return res.data.result;
  } catch (error) {
    console.error("Error fetching block count:", error);
    throw error;
  }
};

