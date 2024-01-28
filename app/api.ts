import axios from "axios"

const API_URL = "https://ranker.yehoyada.com";

export interface RankResponse {
    score: number;
}  

export async function rankApi(username: string) {
    return (await axios.get(`${API_URL}/score?username=${username}`)).data as RankResponse
}