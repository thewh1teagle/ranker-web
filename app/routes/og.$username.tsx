import { LoaderFunctionArgs } from "@remix-run/node";
import satori from "satori";
import svg2img from "svg2img";
import { rankApi } from "~/api";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { username } = params;
  let jsx: JSX.Element
  if (username) {
    try {
      const rank = await rankApi(username);
      jsx = (
        <div style={{ display: "flex" }}>
          <h1>{username} has rank of {rank.score}</h1>
        </div>
      );
    } catch {
      jsx = (
        <div style={{ display: "flex" }}>
          <h1>Rank Any Github Profile!</h1>
        </div>
      );
    }

  } else {
    jsx = (
      <div style={{ display: "flex" }}>
        <h1>Rank Any Github Profile!</h1>
      </div>
    );
  }

  const res = await fetch(new URL("/fonts/Roboto-Medium.ttf", request.url));
  const fontBuffer = await res.arrayBuffer();
  const svg = await satori(jsx, {
    width: 600,
    height: 400,
    fonts: [
      {
        name: "Roboto",
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: fontBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const { data, error } = await new Promise(
    (
      resolve: (value: { data: Buffer | null; error: Error | null }) => void
    ) => {
      svg2img(svg, (error: any, buffer: any) => {
        if (error) {
          resolve({ data: null, error });
        } else {
          resolve({ data: buffer, error: null });
        }
      });
    }
  );
  if (error) {
    return new Response(error.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
