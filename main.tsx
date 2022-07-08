/** @jsx h */
import { h, html } from "https://deno.land/x/htm@0.0.2/mod.tsx";
import { serve } from "https://deno.land/std/http/mod.ts";
import { parseUrlParams } from './parseUrlParams.ts';
import { parseSeconds } from "./parseSeconds.ts";
import { getScript } from "./getScript.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

const urlSchema = z.object({
  duration: z.number().positive(),
  finishText: z.string().optional(),
});


function reqHandler(req: Request) {
  const u = new URL(req.url);
  if(u.pathname === "/favicon.ico") return new Response('', {status: 404})

  const urlParams: Record<string, string | number | boolean> = {};
  for (const p of u.searchParams) {
    urlParams[p[0]] = parseUrlParams(p[1]);
  }

  try {
    const { duration, finishText } = urlSchema.parse(urlParams);
    const script = getScript(duration, finishText);

    return html({
      title: "Countdown timer mnik01",
      body: (
        <main>
          <div id="background" class="w-screen h-screen bg-blue-300 flex items-center justify-center">
            <h1 id="timer" class="text-white font-light" style={`font-size: 27rem; font-family: 'Inter', 'Roboto', sans-serif;`}>
              {parseSeconds(duration)}
            </h1>
          </div>
        </main>
      ),
      scripts: [script]
    })
  } catch (error) {
    console.error(error);
    return new Response('Sorry invalid query params in URL. Duration number required');
  }
}
serve(reqHandler, { port: 8000 });
