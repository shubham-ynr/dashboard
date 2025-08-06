
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useSidebar } from "./ui/sidebar";
import React from "react";
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils";

export default function HeaderCard({ cards }) {
    const { isMobile } = useSidebar();
    const LOCAL_KEY = "headerCarouselIndex";
    const [emblaApi, setEmblaApi] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(() => {
        const stored = localStorage.getItem(LOCAL_KEY);
        return stored ? Number(stored) : 0;
    });

    React.useEffect(() => {
        localStorage.setItem(LOCAL_KEY, selectedIndex);
    }, [selectedIndex]);

    React.useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };
        emblaApi.on("select", onSelect);
        emblaApi.scrollTo(selectedIndex);
        onSelect();
        return () => emblaApi.off("select", onSelect);
    }, [emblaApi]);

    const resolveIcon = (iconName, className = "") => {
        const Icon = Icons[iconName];
        return Icon ? <Icon className={cn("w-4 h-4 border-none", className)} /> : null;
    };


    if (isMobile) {
        return (
            <div className="w-full">
                <Carousel className="w-full" opts={{ loop: true }} setApi={setEmblaApi}>
                    <CarouselContent>
                        {cards.map((card, idx) => {
                            const badgeColor = card.change >= 0 ? "text-green-500 border-green-700" : "text-red-500 border-red-700";
                            return (
                                <CarouselItem key={idx} className="pl-4 pr-px">
                                    <div className="card-outer border px-6 py-3 flex flex-col justify-between shadow-md relative rounded-xs bg-sidebar/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-normal">{card.title}</span>
                                            {card.change != null && (
                                                <span
                                                    className={`px-2 py-1 rounded border text-xs font-medium ${badgeColor}`}
                                                >
                                                    {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
                                                </span>
                                            )}
                                            {card.icon != null && (
                                                <span
                                                    className={`px-2 py-1 rounded border text-xs font-medium ${card.iconClass}`}
                                                >
                                                    {card.icon ? resolveIcon(card.icon, card.iconClass) : ""}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-2xl font-semibold">{card.value}</div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                </Carousel>
                <div className="flex justify-center items-center mt-2 gap-2">
                    {cards.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${selectedIndex === idx ? "bg-primary scale-125" : "bg-muted"}`}
                            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
            {cards.map((card, idx) => {
                const badgeColor = card.change >= 0 ? "text-green-500 border-green-700" : "text-red-500 border-red-700";
                return (
                    <div key={idx} className="card-outer border px-6 py-3 flex flex-col justify-between shadow-md relative rounded-xs hover:shadow-md hover:translate-y-[-2px] transition-all bg-sidebar/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-normal">{card.title}</span>
                            {card.change != null && (
                                <span
                                    className={`px-2 py-1 rounded border text-xs font-medium ${badgeColor}`}
                                >
                                    {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
                                </span>
                            )}
                            {card.icon != null && (
                                <span
                                    className={`px-2 py-1 rounded border text-xs font-medium ${card.iconClass}`}
                                >
                                    {card.icon ? resolveIcon(card.icon) : ""}
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-semibold">{card.value}</div>
                    </div>
                );
            })}
        </div>
    );
}
