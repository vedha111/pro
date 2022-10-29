import {
  CalendarIcon,
  ScaleIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { MegaphoneIcon } from "@heroicons/react/24/outline";
import { json, redirect } from "@remix-run/node";
import {
  useCatch,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import classNames from "clsx";
import { format, formatISO } from "date-fns";
import { ErrorAlert } from "~/components/error-alert";
import { getUser } from "~/user.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  if (!search) {
    const searchParams = new URLSearchParams([["search", "kentcdodds"]]);

    return redirect(`/?${searchParams}`);
  }

  try {
    const user = await getUser(search);

    return json({ user });
  } catch {
    throw new Response("Not found", { status: 404 });
  }
}

export function meta({ data }) {
  if (data?.user?.name) {
    return {
      title: `${data.user.name} - DevFinder`,
    };
  }

  return {
    title: "User not found - DevFinder",
  };
}

export default function IndexRoute() {
  const data = useLoaderData();
  const transition = useTransition();
  const searching = Boolean(transition.submission);

  return (
    <div
      className={classNames(
        searching ? "opacity-75 transition-opacity delay-200 duration-200" : ""
      )}
    >
      <h1 className="sr-only">{`${data.user.login}'s Profile`}</h1>
      <div className="space-y-4">
        <section aria-labelledby="profile-overview-title">
          <h2 className="sr-only" id="profile-overview-title">
            Profile Overview
          </h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  <div className="flex-shrink-0">
                    <img
                      className="mx-auto h-20 w-20 rounded-full"
                      src={data.user.avatarUrl}
                      alt=""
                    />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    <p className="text-sm font-medium text-gray-600">
                      {data.user.login}
                    </p>
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {`${data.user.login}'s Profile`}
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      Joined{" "}
                      <time
                        dateTime={formatISO(new Date(data.user.createdAt))}
                        className="text-gray-900"
                      >
                        {format(new Date(data.user.createdAt), "PP")}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex justify-center sm:mt-0">
                  <a
                    href={data.user.url}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    View profile
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
              <div className="px-6 py-5 text-center text-sm font-medium">
                <span className="text-gray-900">
                  {data.user.allRepositories.totalCount.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-gray-600">Repositories</span>
              </div>
              <div className="px-6 py-5 text-center text-sm font-medium">
                <span className="text-gray-900">
                  {data.user.followers.totalCount.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-gray-600">Followers</span>
              </div>
              <div className="px-6 py-5 text-center text-sm font-medium">
                <span className="text-gray-900">
                  {data.user.following.totalCount.toLocaleString("en-US")}
                </span>{" "}
                <span className="text-gray-600">Following</span>
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="profile-details-title">
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <h2
                id="profile-details-title"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Profile Details
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  {data.user.email.length !== 0 ? (
                    <dd className="text-sm text-gray-900">
                      <a
                        href={`mailto:${data.user.email}`}
                        className="hover:underline"
                      >
                        {data.user.email}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Location
                  </dt>
                  {data.user.location ? (
                    <dd className="text-sm text-gray-900">
                      {data.user.location}
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  {data.user.company ? (
                    <dd className="text-sm text-gray-900">
                      {data.user.company}
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  {data.user.websiteUrl ? (
                    <dd className="text-sm text-gray-900">
                      <a
                        href={data.user.websiteUrl}
                        className="hover:underline"
                      >
                        {data.user.websiteUrl}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Twitter</dt>
                  {data.user.twitterUsername ? (
                    <dd className="text-sm text-gray-900">
                      <a
                        href={`https://twitter.com/${data.user.twitterUsername}`}
                        className="hover:underline"
                      >
                        {data.user.twitterUsername}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  {data.user.status &&
                  data.user.status.message &&
                  data.user.status.emojiHTML ? (
                    <dd
                      title={data.user.status.message}
                      className="truncate text-sm text-gray-900"
                    >
                      <span
                        className="inline-block"
                        dangerouslySetInnerHTML={{
                          __html: data.user.status.emojiHTML,
                        }}
                      />{" "}
                      {data.user.status.message}
                    </dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  {data.user.bio ? (
                    <dd className="text-sm text-gray-900">{data.user.bio}</dd>
                  ) : (
                    <dd className="text-sm text-gray-500">N/A</dd>
                  )}
                </div>
              </dl>
            </div>
          </div>
        </section>
        <section aria-labelledby="top-repositories-title">
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <h2
                id="top-repositories-title"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Top Repositories
              </h2>
            </div>
            {data.user.repositories.nodes.length !== 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {data.user.repositories.nodes.map((repository) => (
                  <li
                    key={repository.name}
                    className="relative focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-500 hover:bg-gray-50"
                  >
                    <div className="p-4 sm:px-6">
                      <div className="flex items-center justify-between gap-x-3">
                        <a href={repository.url} className="focus:outline-none">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {repository.name}
                          </p>
                        </a>
                        <div className="flex flex-shrink-0">
                          {repository.primaryLanguage && (
                            <p className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-800 ring-1 ring-gray-300">
                              <svg
                                viewBox="0 0 8 8"
                                fill="currentColor"
                                aria-hidden
                                style={{
                                  color: repository.primaryLanguage.color,
                                }}
                                className="-ml-0.5 mr-1.5 h-2 w-2"
                              >
                                <circle cx={4} cy={4} r={3} />
                              </svg>
                              {repository.primaryLanguage.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 space-y-2.5">
                        {repository.description && (
                          <p className="max-w-sm text-sm text-gray-600">
                            {repository.description}
                          </p>
                        )}
                        {repository.repositoryTopics.nodes.length !== 0 && (
                          <p className="flex gap-1 truncate">
                            {repository.repositoryTopics.nodes.map((topic) => (
                              <span
                                key={topic.topic.name}
                                className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800"
                              >
                                {topic.topic.name}
                              </span>
                            ))}
                          </p>
                        )}
                        <div className="space-y-2 sm:flex sm:items-center sm:gap-x-6 sm:space-y-0">
                          <p className="flex items-center text-sm text-gray-500">
                            <StarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            {repository.stargazerCount.toLocaleString("en-US")}
                          </p>
                          <p className="flex items-center text-sm text-gray-500">
                            <ShareIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            {repository.forkCount.toLocaleString("en-US")}
                          </p>
                          {repository.licenseInfo && (
                            <p className="flex items-center text-sm text-gray-500">
                              <ScaleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                              {repository.licenseInfo.name}
                            </p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <p>
                              Updated{" "}
                              <time
                                dateTime={formatISO(
                                  new Date(repository.updatedAt)
                                )}
                              >
                                {format(new Date(repository.updatedAt), "PP")}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <MegaphoneIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No repositories
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This user doesn't seem to have any public repositories.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";

  switch (caught.status) {
    case 404: {
      return (
        <ErrorAlert
          title="User not found"
          description={`We couldn't find a GitHub user by the login "${currentSearch}".`}
        />
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary({ error }) {
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  console.error(error);

  return (
    <ErrorAlert
      title="An error occured"
      description={`There was an error loading GitHub user by the login "${currentSearch}". Sorry about that.`}
    />
  );
}
