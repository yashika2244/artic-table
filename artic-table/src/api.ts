import axios from "axios";
import type { ApiResponse } from "./types";

export const fetchArtworks = async (page: number): Promise<ApiResponse> => {
  const res = await axios.get(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );
  return res.data;
};