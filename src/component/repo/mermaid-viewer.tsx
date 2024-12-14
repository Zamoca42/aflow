"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import panzoom from "svg-pan-zoom";

interface MermaidViewerProps {
  code: string;
  activeTab: string;
}

export function MermaidViewer({ code, activeTab }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pzoomRef = useRef<SvgPanZoom.Instance>();
  const [zoom, setZoom] = useState(1);

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
          svgElement.style.width = "100%";
          svgElement.style.height = "100%";

          if (!svgElement.getAttribute("viewBox")) {
            const bbox = svgElement.getBBox();
            svgElement.setAttribute(
              "viewBox",
              `0 0 ${bbox.width} ${bbox.height}`
            );
          }

          const bbox = svgElement.getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            pzoomRef.current = panzoom(svgElement, {
              controlIconsEnabled: false,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 3,
              zoomScaleSensitivity: 0.1,
            });
          }
        }
      }, 100);

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

  return (
    <div ref={containerRef} className="relative">
      <pre className="mermaid min-h-[25vh]">{code}</pre>
    </div>
  );
}
