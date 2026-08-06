import { Head, Link } from "@inertiajs/react";
import {
    IconShoppingCart,
    IconReceipt,
    IconUsers,
    IconChartBar,
    IconBox,
    IconBrandGithub,
    IconArrowRight,
    IconCheck,
    IconDeviceMobile,
    IconCloudLock,
    IconReportMoney,
} from "@tabler/icons-react";

export default function Welcome() {
    const features = [
        {
            icon: IconBrandGithub,
            title: "Laravel Terbaru",
            desc: "Dibangun dengan framework Laravel versi terbaru untuk keamanan dan performa maksimal",
        },
        {
            icon: IconDeviceMobile,
            title: "React & Inertia",
            desc: "Frontend reaktif menggunakan React JS dan Inertia JS tanpa perlu membuat API terpisah",
        },
        {
            icon: IconCloudLock,
            title: "SSO NexaID",
            desc: "Terintegrasi dengan Single Sign-On NexaID untuk kemudahan autentikasi terpusat",
        },
        {
            icon: IconCheck,
            title: "Siap Pakai",
            desc: "Struktur dasar seperti User, Role, dan Permission sudah disiapkan untuk pengembangan lebih lanjut",
        },
    ];

    const techStack = [
        { name: "Laravel", color: "bg-red-500" },
        { name: "Inertia.js", color: "bg-purple-500" },
        { name: "React", color: "bg-cyan-500" },
        { name: "TailwindCSS", color: "bg-sky-500" },
        { name: "NexaID", color: "bg-orange-500" },
    ];

    return (
        <>
            <Head title="Template RSCH Jember" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                <IconCloudLock
                                    size={22}
                                    className="text-white"
                                />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                Template RSCH Jember
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a
                                href="#features"
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"
                            >
                                Kelebihan
                            </a>
                            <a
                                href="#tech"
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors"
                            >
                                Teknologi
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-500 transition-colors"
                            >
                                Masuk (SSO NexaID)
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
                                <IconCheck size={16} />
                                Template Tipe Satu
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Template Pengembangan Aplikasi
                                <span className="block mt-2 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                                    RSCH Jember
                                </span>
                            </h1>

                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Template ini adalah kerangka dasar (tipe satu) yang dirancang khusus untuk mempercepat pengembangan aplikasi di lingkungan Rumah Sakit Citra Husada (RSCH) Jember.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl hover:from-primary-600 hover:to-primary-700 shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    Coba Sekarang
                                    <IconArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="py-20 px-6 bg-white dark:bg-slate-900"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Kelebihan Utama
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Mengapa menggunakan template RSCH Jember ini?
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon
                                            size={24}
                                            className="text-white"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section id="tech" className="py-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Tech Stack
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-12">
                            Dibangun dengan teknologi modern yang cepat dan stabil
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {techStack.map((tech, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full ${tech.color}`}
                                    />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {tech.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                <IconCloudLock
                                    size={16}
                                    className="text-white"
                                />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Template RSCH Jember
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} RSCH Jember - IT Support
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
