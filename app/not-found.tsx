import Link from "next/link";

function NotFound() {
  return (
    <main className="flex h-svh">
      <div className="m-auto flex-col text-center">
        <div className="flex">
          <h1>404</h1>
          <span className="mx-1">|</span>
          <p>Page Not Found</p>
        </div>
        <Link className="m-auto font-bold" href="/">
          Go Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
