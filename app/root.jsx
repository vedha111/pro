import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import styles from "~/styles/app.css";

export const meta = () => {
  return {
    charset: "utf-8",
    title: "DevFinder",
    viewport: "width=device-width,initial-scale=1",
  };
};

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "preload",
      href: "/fonts/Inter-roman.var.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
  ];
}

export default function App() {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-full">
          <div className="bg-gray-800 pb-24">
            <nav className="bg-gray-800">
              <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="flex items-center justify-between gap-x-6 py-5">
                  <div>
                    <svg
                      viewBox="0 0 49 42"
                      fill="currentColor"
                      aria-hidden
                      className="block h-8 w-auto text-brand-500"
                    >
                      <path d="M28.537 1.002V1H1.592v39.908H28.537v-.002c11.01-.17 19.87-9.03 19.87-19.952 0-10.921-8.86-19.782-19.87-19.952Zm-7.156 22.85v3.875c0 3.453-2.822 6.242-6.316 6.242-3.494 0-6.283-2.789-6.283-6.242V14.181c0-3.453 2.789-6.242 6.283-6.242s6.316 2.789 6.316 6.242v9.67Z" />
                    </svg>
                  </div>
                  <div className="flex flex-1 justify-end">
                    <div className="w-full md:max-w-xs">
                      <SearchForm />
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <main className="-mt-24 pb-8">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <Outlet />
            </div>
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function SearchForm() {
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const transition = useTransition();
  const searching = Boolean(transition.submission);
  const inputRef = useRef(null);

  useEffect(() => {
    function focusInput(event) {
      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.select();
        inputRef.current?.scrollIntoView({ block: "center" });
      }
    }

    window.addEventListener("keydown", focusInput);

    return function () {
      window.removeEventListener("keydown", focusInput);
    };
  }, []);

  return (
    <Form action="/" role="search">
      <div>
        <label htmlFor="search" className="sr-only">
          Search users
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {searching ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
          </div>
          <input
            ref={inputRef}
            type="search"
            name="search"
            id="search"
            defaultValue={currentSearch}
            required
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
            placeholder="Search"
          />
        </div>
      </div>
    </Form>
  );
}
