import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import axios from "axios";
import { json, useSearchParams } from "@remix-run/react";
import { RankResponse, rankApi } from "~/api";



export async function loader({request}: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams
  const username = params.get('username')
  return json({username, requestURL: request.url})
}



export const meta: MetaFunction<typeof loader> = ({data}) => {
  const imageUrl = new URL(`/og/${data?.username ?? ''}`, data.requestURL).toString()
  return [
    { title: "Ranker Web" },
    { name: "description", content: "Rank Github Profile" },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "WriteHub",
    },
    {
      property: "og:image",
      content: imageUrl,
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
  ];
};





function extractGitHubUsername(input: string): string | null {
  // Regular expression to match GitHub repository URLs
  const githubUrlRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)(?:\/|$)/i;

  // Match the input against the regex
  const urlMatch = input.match(githubUrlRegex);

  // If there is a match in the URL format, extract the username
  if (urlMatch) {
    return urlMatch[1];
  }

  // If no URL match, assume the input is the username itself
  return input.trim() || null;
}


export default function Index() {
  const [scoreResponse, setScoreResponse] = useState<RankResponse>();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams()


  useEffect(() => {
    const paramUsername = searchParams.get('username')
    console.log(paramUsername)
    if (paramUsername) {
      setInputValue(paramUsername)
      rank(paramUsername)
    }
  }, [])

  async function rank(value: string) {
    if (!value) {
      console.log('empty usernmae')
      return;
    }
    setScoreResponse(undefined)
    setLoading(true)
    
    const username = extractGitHubUsername(value)
    if (username) {
      const newParams = new URLSearchParams()
      newParams.set('username', username)
      setSearchParams(newParams, {preventScrollReset: true})
      try {
        const res = await rankApi(username)
        const data = res.data as RankResponse
        setScoreResponse(data);
        setLoading(false);
      } catch (e) {
        alert(`Error! can't reach server. see console`)
        console.error(e)
        setLoading(false)
      }
      
    } else {
      alert('Invalid username cant parse')
    }

    
  }

  function rankMock() {
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
        <button onClick={() => rank(inputValue)} className="btn btn-primary join-item">
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
