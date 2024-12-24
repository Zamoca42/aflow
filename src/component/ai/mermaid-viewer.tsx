"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import panzoom from "svg-pan-zoom";
import { Button } from "@/component/ui/button";
import { MinusIcon, PlusIcon, RefreshCcwIcon } from "lucide-react";

const DEFAULT_ZOOM = 1.0;
interface MermaidViewerProps {
  code: string;
  activeTab: string;
}

export function MermaidViewer({ code, activeTab }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pzoomRef = useRef<SvgPanZoom.Instance>();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    if (!containerRef.current || activeTab !== "preview") return;

    try {
      pzoomRef.current?.destroy();

      mermaid.initialize({
        startOnLoad: true,
        theme: "neutral",
        securityLevel: "loose",
      });
      mermaid.contentLoaded();

      setTimeout(() => {
        const mermaidElement = containerRef.current?.querySelector(".mermaid");
        const svgElement = mermaidElement?.querySelector("svg");

        if (svgElement) {
          svgElement.style.maxWidth = "100%";
          svgElement.style.maxHeight = "100%";
          svgElement.style.width = "100%";
          svgElement.style.height = "50vh";

          const bbox = svgElement.getBBox();
          if (!svgElement.getAttribute("viewBox")) {
            svgElement.setAttribute(
              "viewBox",
              `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
            );
          }

          if (bbox.width > 0 && bbox.height > 0) {
            pzoomRef.current = panzoom(svgElement, {
              controlIconsEnabled: false,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 3,
              zoomScaleSensitivity: 0.1,
              onZoom: (zoom) => {
                setZoom(zoom);
              },
            });

            pzoomRef.current?.zoom(DEFAULT_ZOOM);
          }
        }
      }, 50);

      return () => {
        pzoomRef.current?.destroy();
      };
    } catch (error) {
      console.error("Mermaid rendering failed:", error);
    }
  }, [code, activeTab]);

  useEffect(() => {
    const handleResize = () => {
      pzoomRef.current?.resize();
      pzoomRef.current?.fit();
      pzoomRef.current?.center();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleZoomIn = () => {
    pzoomRef.current?.zoomIn();
    setZoom(pzoomRef.current?.getZoom() || DEFAULT_ZOOM);
  };

  const handleZoomOut = () => {
    pzoomRef.current?.zoomOut();
    setZoom(pzoomRef.current?.getZoom() || DEFAULT_ZOOM);
  };

  const handleReset = () => {
    pzoomRef.current?.center();
    pzoomRef.current?.zoom(DEFAULT_ZOOM);
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <div ref={containerRef} className="relative">
      <pre className="mermaid min-h-[50vh]">{code}</pre>
      <div className="absolute bottom-4 right-4 flex flex-col rounded-lg p-1 shadow-lg backdrop-blur">
        <div className="text-center text-xs text-muted-foreground h-8 w-8 py-2">
          {Math.floor(zoom * 100)}
          <span aria-hidden="true">&#37;</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button
            onClick={handleZoomIn}
            variant="ghost"
            title="Zoom In"
            size="icon"
          >
            <PlusIcon />
          </Button>
          <Button
            variant="ghost"
            onClick={handleZoomOut}
            title="Zoom Out"
            size="icon"
          >
            <MinusIcon />
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            title="Reset"
            size="icon"
          >
            <RefreshCcwIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
