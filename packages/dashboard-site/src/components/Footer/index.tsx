import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="mt-36 bg-[#1a1a1c] font-sans text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex justify-center text-teal-600">
            <Image
              alt="logo"
              src="/logo-transparent.svg"
              width="75"
              height="75"
            />
          </div>

          <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-white">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
            consequuntur amet culpa cum itaque neque.
          </p>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            <li>
              <Link
                className="text-white transition hover:text-gray-200/75"
                href="/"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-white transition hover:text-gray-200/75"
                href="/Meni_Privacy_Policy.pdf"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
