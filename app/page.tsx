import Image from "next/image";
import drawing from "../public/drawing.svg"
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="max-w-screen h-screen max-h-screen lg:flex lg:flex-row">
      <div className="w-full h-full lg:w-3/5 flex flex-col justify-center mb-1/2 p-3">
        <h1 className="text-5xl lg:text-7xl font-bold">Goal tracking app...</h1>
        <h2 className="text-xl lg:text-2xl">...which lets you add metrics and measure your progress.</h2>
        <div className="w-full m-2 flex justify-center lg:block">
          <Link href="/view"><Button>CLICK HERE TO VISIT DASHBOARD</Button></Link>
        </div>
      </div>
      <div className="hidden lg:flex w-2/5 h-full justify-center items-center">
        <Image src={drawing} width={500} height={500} alt="Picture of progressing a goal"/>
      </div>
    </div>
  );
}
