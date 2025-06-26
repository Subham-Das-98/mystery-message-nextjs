import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-800 min-h-screen">
      <header>
        <nav>
          <Link href="/sign-in" className="text-blue-400 hover:underline">
            Sign in
          </Link>
          <Link href="/sign-up" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </nav>
      </header>
      <main className="text-white">home page</main>
      <footer className="text-white">footer</footer>
    </div>
  );
}
