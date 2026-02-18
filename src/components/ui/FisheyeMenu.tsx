
import React, { useRef } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    MotionValue,
} from "framer-motion";
import {
    Home,
    BarChart3,
    PieChart,
    TrendingUp,
    Search,
    BookOpen,
    Target,
    LineChart,
    DollarSign,
    Activity,
    Layers,
    Database,
} from "lucide-react";

// Types for our navigation items
type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
    description?: string; // For tooltip
};

const ITEMS: NavItem[] = [
    { title: "Home", href: "/", icon: Home, description: "Jumpstart Scaling" },

    // Services
    { title: "Paid Acquisition", href: "/services/paid-acquisition", icon: Target, description: "Scale Ad Spend" },
    { title: "Funnel Arch", href: "/services/funnel-architecture", icon: Layers, description: "Optimize Conversion" },
    { title: "CRM Ops", href: "/services/crm-transformation", icon: Database, description: "HubSpot/Salesforce" },
    { title: "Attribution", href: "/services/data-attribution", icon: BarChart3, description: "Tracking & Analytics" },

    // Calculators (Hotlinks)
    { title: "CAC", href: "/resources/calculators#cac-calculator", icon: DollarSign, description: "Acquisition Cost" },
    { title: "Churn", href: "/resources/calculators#churn-calculator", icon: Activity, description: "Retention Rate" },
    { title: "LTV", href: "/resources/calculators#ltv-calculator", icon: TrendingUp, description: "Lifetime Value" },
    { title: "ROAS", href: "/resources/calculators#break-even-calculator", icon: PieChart, description: "Ad Profitability" },
    { title: "MRR", href: "/resources/calculators#mrr-forecast", icon: LineChart, description: "Revenue Forecast" },

    // Tools/Intel
    { title: "Intel", href: "/intel", icon: BookOpen, description: "Strategy & Insights" },
    { title: "Full Audit", href: "/audit", icon: Search, description: "Get Your Score" },
];

export default function FisheyeMenu() {
    let mouseX = useMotionValue(Infinity);

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-end gap-3 px-3 pb-2.5">
            {/* Refined Glass Background */}
            <div className="absolute inset-0 bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl -z-10 ring-1 ring-white/5" />

            <div
                className="flex items-end gap-x-2 h-16 items-end px-1"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
            >
                {ITEMS.map((item, i) => (
                    <DockIcon mouseX={mouseX} key={i} item={item} />
                ))}
            </div>
        </nav>
    );
}

function DockIcon({
    mouseX,
    item,
}: {
    mouseX: MotionValue;
    item: NavItem;
}) {
    let ref = useRef<HTMLDivElement>(null);

    // Distance calculation
    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Re-tuned Scale (Subtle, Responsive)
    // Base width: 36px, Max width: 64px (was 45 -> 90)
    let widthSync = useTransform(distance, [-120, 0, 120] as const, [36, 64, 36] as const);
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 });

    // Icon opacity/scale inside the button
    let iconScaleSync = useTransform(distance, [-120, 0, 120] as const, [0.75, 1.2, 0.75] as const);
    let iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 180, damping: 14 });

    return (
        <a href={item.href} className="relative group focus:outline-none">
            {/* Tooltip - Higher contrast, smaller text */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-[#E8C677] text-[10px] uppercase font-mono tracking-wider py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#E8C677]/20 shadow-lg translate-y-2 group-hover:translate-y-0 duration-200">
                {item.title}
            </div>

            <motion.div
                ref={ref}
                style={{ width }}
                className="aspect-square rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#E8C677]/10 group-hover:border-[#E8C677]/40 shadow-lg relative transition-colors duration-200"
            >
                <motion.div style={{ scale: iconScale }}>
                    {React.createElement(item.icon, { className: "text-white/80 group-hover:text-[#E8C677] transition-colors", strokeWidth: 1.5 })}
                </motion.div>
            </motion.div>
        </a>
    );
}
