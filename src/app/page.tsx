import Link from "next/link";
import Image from "next/image";
import HeroSearch from '@/components/home/HeroSearch';

export default function Home() {
  return (
    <div className="bg-urban-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-brand-blue overflow-hidden">
        {/* Abstract Background - Subtle pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/90"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in-up w-full max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-inter text-white tracking-tight mb-4 flex flex-col items-center drop-shadow-lg">
            <span>MOONBLUES<span className="text-brand-yellow">STORE</span></span>
            <span className="text-xl sm:text-2xl tracking-[0.5em] font-medium mt-4 text-urban-gray font-inter uppercase">STREETWEAR</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 font-kanit max-w-2xl mx-auto leading-relaxed">
            แหล่งรวมสนีกเกอร์รุ่นหายาก เช็คราคากลางแบบ Real-time<br className="hidden sm:block" />
            ของแท้ คัดสรรเพื่อคนรักสตรีทแฟชั่นโดยเฉพาะ
          </p>

          <div className="mt-12 w-full max-w-xl mx-auto">
            <HeroSearch />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10 text-gray-300 font-kanit text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_8px_theme('colors.brand.green')]"></span> เช็คราคาฟรี
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_8px_theme('colors.brand.green')]"></span> พรีออเดอร์ทุกรุ่น
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-green rounded-full shadow-[0_0_8px_theme('colors.brand.green')]"></span> ของแท้ 100%
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Pre-order Process) */}
      <section className="py-24 bg-urban-light relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-blue/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-2 block">Easy Steps</span>
            <h2 className="text-3xl md:text-4xl font-black font-kanit text-urban-dark">
              สั่งซื้อง่ายๆ ใน <span className="text-brand-blue">3 ขั้นตอน</span>
            </h2>
            <div className="w-20 h-1.5 bg-brand-yellow mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-urban-gray font-kanit text-lg max-w-2xl mx-auto">
              อยากได้คู่ไหน แค่ทักมา เราจัดการให้ครบ จบในที่เดียว
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border-2 border-transparent hover:border-brand-blue/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-9xl font-black text-brand-blue font-inter">1</span>
              </div>
              <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                👟
              </div>
              <h3 className="text-xl font-bold font-kanit text-urban-dark mb-3">1. เลือกรุ่นที่ใช่</h3>
              <p className="text-urban-gray font-kanit leading-relaxed">
                พิมพ์ชื่อรุ่นที่อยากได้ในช่องค้นหา หรือจะแคปรูปส่งมาให้แอดมินช่วยหาก็ได้นะ
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border-2 border-transparent hover:border-brand-blue/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-9xl font-black text-brand-blue font-inter">2</span>
              </div>
              <div className="w-20 h-20 bg-yellow-50 text-brand-yellow rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                💬
              </div>
              <h3 className="text-xl font-bold font-kanit text-urban-dark mb-3">2. เช็คราคาชัวร์ๆ</h3>
              <p className="text-urban-gray font-kanit leading-relaxed">
                กดปุ่ม Line ทักแอดมินเพื่อเช็คราคาล่าสุด ไซส์ที่เป๊ะ และโปรโมชั่นเด็ดๆ (ราคาดีแน่นอน!)
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden border-2 border-transparent hover:border-brand-blue/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-9xl font-black text-brand-blue font-inter">3</span>
              </div>
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                🏠
              </div>
              <h3 className="text-xl font-bold font-kanit text-urban-dark mb-3">3. นอนรอรับของ</h3>
              <p className="text-urban-gray font-kanit leading-relaxed">
                โอนเงินยืนยันออเดอร์ แล้วนั่งจิบกาแฟรอรับรองเท้าคู่โปรดส่งตรงถึงหน้าบ้าน
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link href="/search" className="inline-flex items-center justify-center gap-3 bg-brand-blue text-white px-10 py-4 rounded-full font-bold font-kanit text-lg tracking-wide hover:bg-brand-yellow hover:text-brand-blue shadow-xl shadow-brand-blue/20 hover:shadow-brand-yellow/30 transition-all transform hover:scale-105 group">
              <span>เริ่มค้นหาเลย</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <p className="mt-4 text-sm text-urban-gray font-kanit">
              หรือทักไลน์สอบถาม <span className="text-brand-blue font-bold cursor-pointer hover:underline">@moonbluesstore</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
