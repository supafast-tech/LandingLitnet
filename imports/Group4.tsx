import imgImage from "figma:asset/fec419b73bb2610d1119d69595413eda7f1d8d3c.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute flex h-[1240px] items-center justify-center left-0 right-0 top-0">
        <div className="flex-none h-[1240px] rotate-[180deg] scale-y-[-100%] w-[1920px]">
          <div className="relative size-full" data-name="image">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[700px] items-center justify-center left-0 right-0 top-0">
        <div className="flex-none h-[700px] rotate-[180deg] scale-y-[-100%] w-[1920px]">
          <div className="bg-gradient-to-b from-[#000000] opacity-80 size-full to-[rgba(0,0,0,0)] via-60% via-[rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </div>
  );
}