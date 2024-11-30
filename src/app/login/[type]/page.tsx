import Image from "next/image";
import LoginForm from "../../components/LoginForm";
import Link from "next/link";

// Convert the page component to an async function (No need to await params)
const Page = ({ params }: { params: { type: string } }) => {
  const { type } = params; // No need to await here

  const normalizeType = (type: string) => {
    return (
      type.replace(/%20/g, " ").charAt(0) +
      type.replace(/%20/g, " ").slice(1).toLowerCase()
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-foreground">
      <Link href="/">
        <Image
          src="/icon.png"
          alt="logo"
          width={180}
          height={180}
          className="absolute top-0 left-0 p-4 drop-shadow-lg"
        />
      </Link>
      <LoginForm type={normalizeType(type)} />
    </div>
  );
};

export default Page;
