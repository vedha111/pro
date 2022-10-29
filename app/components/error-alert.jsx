import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function ErrorAlert({ title, description }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium leading-6 text-gray-900 sm:mt-5">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}
