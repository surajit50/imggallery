import Link from "next/link";

const Nav = () => {
  return (
    <nav>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/register">Register</Link>
      <Link href="/galleryimage">Image Upload</Link>
    </nav>
  );
};

export default Nav;
