import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

export function Hero() {
  return (
    <section id="hero">
      <div className="ml-48 mt-16 relative h-full overflow-hidden py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <div className="text-center space-y-2 mx-auto lg:text-left lg:mx-0">
              <h1 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter lg:mx-0">
                Learn Car Repairs with Expert Video Tutorials
              </h1>
            </div>
            <p className="text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Access exclusive DIY car repair content, step-by-step guides, and professional tips
              through our YouTube-connected platform. Join our community of automotive enthusiasts.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button variant="default" onClick={() => window.location.href = '/videos'}>
                Watch Video Tutorials
              </Button>
            </div>
          </div>
          <HeroVideoDialog
                videoSrc="https://player.vimeo.com/video/1035389865?h=03ddeb089a"
                thumbnailSrc="/Hero_VideoThumbnail.png"
                thumbnailAlt="Featured Car Video"
                animationStyle="from-center"
                className="w-550 mx-auto aspect-video rounded-xl overflow-hidden"
              />
        </div>
      </div>
    </section>
  );
}