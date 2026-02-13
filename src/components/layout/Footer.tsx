const Footer = () => {
    return (
        <footer className="bg-urban-dark text-urban-light border-t border-urban-gray mt-auto pb-24 md:pb-0">
            <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1 flex flex-col items-start">
                        <div className="font-kanit font-black text-2xl tracking-tighter text-urban-white mb-4 flex flex-col items-start leading-none group">
                            <span className="relative">moonblue<span className="text-brand-yellow">.</span>s</span>
                            <span className="text-[0.6rem] tracking-[0.3em] text-urban-gray font-inter mt-1">STREETWEAR</span>
                        </div>
                        <p className="text-xs sm:text-sm text-urban-gray max-w-xs font-kanit">
                            แหล่งรวมรองเท้าหายาก เช็คราคารีเซลแบบเรียลไทม์ ของแท้ 100% เชื่อถือได้ พร้อมบริการสั่งซื้อผ่าน LINE
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 text-urban-white font-kanit">เมนูลัด</h4>
                        <ul className="space-y-2 font-kanit">
                            <li><a href="/search?keyword=new" className="text-urban-gray hover:text-brand-yellow transition-colors text-xs sm:text-sm">สินค้ามาใหม่</a></li>
                            <li><a href="/search?keyword=popular" className="text-urban-gray hover:text-brand-yellow transition-colors text-xs sm:text-sm">แบรนด์ยอดนิยม</a></li>
                            <li><a href="#" className="text-urban-gray hover:text-brand-yellow transition-colors text-xs sm:text-sm">ตารางไซส์</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 text-urban-white font-kanit">ติดต่อเรา</h4>
                        <a href="https://line.me/R/ti/p/@moonbluesstore" target="_blank" className="block text-xs sm:text-sm text-green-400 mb-2 font-kanit hover:text-green-300 transition-colors cursor-pointer font-bold">
                             <span className="mr-1">LINE:</span> @moonbluesstore
                        </a>
                        <p className="text-xs sm:text-sm text-urban-gray font-kanit">Email: support@moonblue.s.com</p>
                    </div>
                </div>
                <div className="mt-8 border-t border-urban-gray/20 pt-8 text-center">
                    <p className="text-[0.65rem] sm:text-xs text-urban-gray font-inter">&copy; {new Date().getFullYear()} MOONBLUE.S STREETWEAR. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
