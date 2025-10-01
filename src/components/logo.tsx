import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-1">
      {/* <LifeBuoy className="w-8 h-8 text-primary" /> */}
      <Image src="/logo.svg" alt="logo" width={32} height={32} />
      <p className="text-xl font-bold tracking-tight">
        <span className="text-primary">Support</span>{" "}
        <span className="text-slate-800">Desk</span>
      </p>
    </div>
  );
};

export default Logo;
