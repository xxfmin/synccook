import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
      <Link href="/login">
        <button>Sign In</button>
      </Link>
    </div>
  );
}
