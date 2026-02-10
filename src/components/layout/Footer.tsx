const Footer = () => {
    return (
        <footer className="bg-urban-dark text-urban-light border-t border-urban-gray mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-start">
                        <div className="font-kanit font-black text-2xl tracking-tighter text-urban-white mb-4 flex flex-col items-start leading-none group">
                            <span className="relative">moonblue<span className="text-brand-yellow">.</span>s</span>
                            <span className="text-[0.6rem] tracking-[0.3em] text-urban-gray font-inter mt-1">STREETWEAR</span>
                        </div>
                        <p className="text-sm text-urban-gray max-w-xs font-kanit">
                            แหล่งรวมรองเท้าหายาก เช็คราคารีเซลแบบเรียลไทม์ ของแท้ 100% เชื่อถือได้ พร้อมบริการสั่งซื้อผ่าน LINE
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold tracking-wider uppercase mb-4 text-urban-white font-kanit">เมนูลัด</h4>
                        <ul className="space-y-2 font-kanit">
                            <li><a href="#" className="text-urban-gray hover:text-brand-yellow transition-colors text-sm">สินค้ามาใหม่</a></li>
                            <li><a href="#" className="text-urban-gray hover:text-brand-yellow transition-colors text-sm">แบรนด์ยอดนิยม</a></li>
                            <li><a href="#" className="text-urban-gray hover:text-brand-yellow transition-colors text-sm">ตารางไซส์</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold tracking-wider uppercase mb-4 text-urban-white font-kanit">ติดต่อเรา</h4>
                        <p className="text-sm text-urban-gray mb-2 font-kanit hover:text-brand-yellow transition-colors cursor-pointer">LINE Official: @moonblue.s</p>
                        <p className="text-sm text-urban-gray font-kanit">Email: support@moonblue.s.com</p>
                    </div>
                </div>
                <div className="mt-8 border-t border-urban-gray pt-8 text-center">
                    <p className="text-xs text-urban-gray font-inter">&copy; {new Date().getFullYear()} MOONBLUE.S STREETWEAR. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
