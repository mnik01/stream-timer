import { serve } from "https://deno.land/std/http/mod.ts";
import { parseUrlParams } from './parseUrlParams.ts'
import { z } from "https://deno.land/x/zod/mod.ts";
import { parseSeconds } from "./parseSeconds.ts";

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

    return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
        <title>Timer mnik01</title>
    </head>
    <body >
      <div id="background" class="w-screen h-screen bg-blue-300 flex items-center justify-center">
        <h1 id="timer" class="text-white font-light" style='font-size: 27rem; font-family: 'Inter', 'Roboto', sans-serif;>${parseSeconds(duration)}</h1>
      </div>
      <script>
        // helper function to convert seconds to minutes and seconds
        function parseSeconds(value) {
          const sec = parseInt(value, 10); // convert value to number if it's string
          let hours   = Math.floor(sec / 3600); // get hours
          let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
          let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
          // add 0 if value < 10; Example: 2 => 02
          if (hours   < 10) {hours   = "0"+hours;}
          if (minutes < 10) {minutes = "0"+minutes;}
          if (seconds < 10) {seconds = "0"+seconds;}
          return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
        }

        const finishText = "${finishText}";
        const h1El = document.getElementById('timer')
        let timeLeft = ${duration - 1};
        h1El.innerHTML = parseSeconds(timeLeft);
        const intervalId = setInterval(() => {
          if (timeLeft <= 0) {
            clearInterval(intervalId);
            h1El.innerHTML = finishText;
            return;
          }
          h1El.innerHTML = parseSeconds(timeLeft);
          timeLeft--;
        }, 1000)
      </script>
    </body>
    </html>
    `, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Sorry invalid query params in URL. Duration number required');
  }
}
serve(reqHandler, { port: 8000 });
