import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080";
export const meta: MetaFunction = () => {
  return [
    { title: "Ranker Web" },
    { name: "description", content: "Rank Github Profile" },
  ];
};

interface RankResponse {
  score: number;
}

export default function Index() {
  const [scoreResponse, setScoreResponse] = useState<RankResponse>();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  async function rank() {
    setScoreResponse(undefined)
    if (!inputValue) {
      return;
    }
    setLoading(true)
    const username = inputValue.includes("http")
      ? inputValue.replace("https", "http").replace("https://github.com/", "")
      : inputValue;

    // const res = await axios.get(`${API_URL}/score?username=hvuhsg`)
    // const data = res.data as RankResponse
    setTimeout(() => {
      setScoreResponse({ score: 100 });
      setLoading(false);
    }, 2000);
  }


  return (
    <div className="mt-10">
      <h1 className="text-5xl text-center">Ranker</h1>
      <div className="flex justify-center mt-5 join">
        <input
          className="input input-bordered min-w-56 join-item w-[300px]"
          placeholder="Github Username / URL"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button onClick={rank} className="btn btn-primary join-item">
          RANK IT!
        </button>
      </div>
      {scoreResponse && (
        <div className="flex justify-center mt-5">
          <div className="stats shadow bg-base-200">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Profile score</div>
              <div className="stat-value text-secondary">{scoreResponse.score}</div>
              <div className="stat-desc">Share with your friends!</div>
            </div>
          </div>
        </div>
      )}
      {!scoreResponse && loading && (
        <div className="flex justify-center mt-10">
        <span className="loading loading-spinner w-[40px] h-[40px] text-primary"></span>
        </div>
      )}
    </div>
  );
}