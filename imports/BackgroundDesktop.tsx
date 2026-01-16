import svgPaths from "./svg-6hm1jyzwc1";
import imgImage from "figma:asset/fec419b73bb2610d1119d69595413eda7f1d8d3c.png";

function Group() {
  return (
    <div className="contents pointer-events-auto sticky top-0">
      <div className="absolute flex h-[1240px] items-center justify-center left-0 top-0 w-[1920px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[1240px] relative w-[1920px]" data-name="image">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[700px] items-center justify-center left-0 right-0 top-0">
        <div className="flex-none h-[700px] rotate-[180deg] scale-y-[-100%] w-[1920px]">
          <div className="bg-gradient-to-b from-[#000000] opacity-80 size-full to-[rgba(0,0,0,0)] via-60% via-[rgba(0,0,0,0.8)]" />
        </div>
      </div>
      <div className="absolute bottom-0 flex h-[837px] items-center justify-center left-1/2 translate-x-[-50%] w-[1200px]">
        <div className="flex-none rotate-[180deg]">
          <div className="h-[837px] opacity-50 w-[1200px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1200 837\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(3.6739e-15 41.85 -60 2.5626e-15 600 418.5)\\\'><stop stop-color=\\\'rgba(0,0,0,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(0,0,0,0.8)\\\' offset=\\\'0.6\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')" }} />
        </div>
      </div>
    </div>
  );
}

export default function BackgroundDesktop() {
  return (
    <div className="relative size-full" data-name="background_desktop">
      <div className="absolute bottom-0 left-0 pointer-events-none top-0">
        <Group />
      </div>
      <div className="absolute bottom-0 h-[1010px] right-0 w-[1142px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1142 1010">
          <path d={svgPaths.p1ef02680} fill="url(#paint0_linear_4_3468)" id="Vector" opacity="0.1" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_4_3468" x1="0" x2="1142" y1="505" y2="505">
              <stop stopColor="#F857A6" />
              <stop offset="1" stopColor="#FF5858" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}