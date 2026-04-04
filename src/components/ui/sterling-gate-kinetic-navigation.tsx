"use client";

import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./sterling-gate-kinetic-nav.css";

export type SterlingNavLink = { href: string; label: string };

export type SterlingGateKineticNavigationProps = {
  links: SterlingNavLink[];
  brand: React.ReactNode;
  /** Язык, аккаунт, корзина — справа от кнопки меню */
  trailing: React.ReactNode;
  menuLabel: string;
  closeLabel: string;
};

function AmbientShapes() {
  const amber = "rgba(251,191,36,0.18)";
  const orange = "rgba(234,88,12,0.14)";
  const rose = "rgba(251,113,133,0.1)";

  return (
    <div className="sg-ambient-background-shapes">
      <svg className="sg-bg-shape sg-bg-shape-1" viewBox="0 0 400 400" fill="none" aria-hidden>
        <circle className="sg-shape-element" cx="80" cy="120" r="40" fill={amber} />
        <circle className="sg-shape-element" cx="300" cy="80" r="60" fill={orange} />
        <circle className="sg-shape-element" cx="200" cy="300" r="80" fill={rose} />
        <circle className="sg-shape-element" cx="350" cy="280" r="30" fill={amber} />
      </svg>

      <svg className="sg-bg-shape sg-bg-shape-2" viewBox="0 0 400 400" fill="none" aria-hidden>
        <path
          className="sg-shape-element"
          d="M0 200 Q100 100, 200 200 T 400 200"
          stroke={amber}
          strokeWidth="60"
          fill="none"
        />
        <path
          className="sg-shape-element"
          d="M0 280 Q100 180, 200 280 T 400 280"
          stroke={orange}
          strokeWidth="40"
          fill="none"
        />
      </svg>

      <svg className="sg-bg-shape sg-bg-shape-3" viewBox="0 0 400 400" fill="none" aria-hidden>
        <circle className="sg-shape-element" cx="50" cy="50" r="8" fill={amber} />
        <circle className="sg-shape-element" cx="150" cy="50" r="8" fill={orange} />
        <circle className="sg-shape-element" cx="250" cy="50" r="8" fill={rose} />
        <circle className="sg-shape-element" cx="350" cy="50" r="8" fill={amber} />
        <circle className="sg-shape-element" cx="100" cy="150" r="12" fill={orange} />
        <circle className="sg-shape-element" cx="200" cy="150" r="12" fill={rose} />
        <circle className="sg-shape-element" cx="300" cy="150" r="12" fill={amber} />
        <circle className="sg-shape-element" cx="50" cy="250" r="10" fill={rose} />
        <circle className="sg-shape-element" cx="150" cy="250" r="10" fill={amber} />
        <circle className="sg-shape-element" cx="250" cy="250" r="10" fill={orange} />
        <circle className="sg-shape-element" cx="350" cy="250" r="10" fill={rose} />
        <circle className="sg-shape-element" cx="100" cy="350" r="6" fill={amber} />
        <circle className="sg-shape-element" cx="200" cy="350" r="6" fill={orange} />
        <circle className="sg-shape-element" cx="300" cy="350" r="6" fill={rose} />
      </svg>

      <svg className="sg-bg-shape sg-bg-shape-4" viewBox="0 0 400 400" fill="none" aria-hidden>
        <path
          className="sg-shape-element"
          d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
          fill={amber}
        />
        <path
          className="sg-shape-element"
          d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
          fill={rose}
        />
      </svg>

      <svg className="sg-bg-shape sg-bg-shape-5" viewBox="0 0 400 400" fill="none" aria-hidden>
        <line
          className="sg-shape-element"
          x1="0"
          y1="100"
          x2="300"
          y2="400"
          stroke={amber}
          strokeWidth="30"
        />
        <line
          className="sg-shape-element"
          x1="100"
          y1="0"
          x2="400"
          y2="300"
          stroke={orange}
          strokeWidth="25"
        />
        <line
          className="sg-shape-element"
          x1="200"
          y1="0"
          x2="400"
          y2="200"
          stroke={rose}
          strokeWidth="20"
        />
      </svg>
    </div>
  );
}

export function SterlingGateKineticNavigation({
  links,
  brand,
  trailing,
  menuLabel,
  closeLabel,
}: SterlingGateKineticNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initialAnimSkip = useRef(true);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const navWrap = root.querySelector(".sg-nav-overlay-wrapper");
    const menu = root.querySelector(".sg-menu-content");
    const overlay = root.querySelector(".sg-overlay");
    const bgPanels = root.querySelectorAll(".sg-backdrop-layer");
    const menuLinks = root.querySelectorAll(".sg-nav-link");

    if (menu) gsap.set(menu, { xPercent: 120 });
    if (navWrap) gsap.set(navWrap, { display: "none" });
    if (overlay) gsap.set(overlay, { autoAlpha: 0 });
    if (bgPanels.length) gsap.set(bgPanels, { xPercent: 101 });
    if (menuLinks.length) gsap.set(menuLinks, { yPercent: 140, rotate: 10 });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(".sg-menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".sg-ambient-background-shapes");

      const cleanups: Array<() => void> = [];

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer
          ? shapesContainer.querySelector(`.sg-bg-shape-${shapeIndex}`)
          : null;
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".sg-shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".sg-bg-shape").forEach((s) => {
              s.classList.remove("sg-active");
            });
          }
          shape.classList.add("sg-active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("sg-active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    }, containerRef);

    return () => ctx.revert();
  }, [links]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (initialAnimSkip.current) {
      initialAnimSkip.current = false;
      return;
    }

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".sg-nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector(".sg-menu-content");
      const overlay = containerRef.current!.querySelector(".sg-overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".sg-backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".sg-nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const menuButtonIcon = containerRef.current!.querySelector(".sg-menu-button-icon");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.45 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575, ease: "power3.out" },
            "<"
          )
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.55, ease: "power3.out" },
            "<+=0.35"
          );
        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.04,
              clearProps: "all",
              duration: 0.4,
            },
            "<+=0.2"
          );
        }
      } else {
        if (navWrap) navWrap.setAttribute("data-nav", "closed");
        tl.to(overlay, { autoAlpha: 0, duration: 0.25 })
          .to(menu, { xPercent: 120, duration: 0.45, ease: "power3.in" }, "<")
          .to(menuButtonIcon, { rotate: 0, duration: 0.35 }, "<")
          .set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="sg-kinetic-root">
      <div className="sg-site-header">
        <div className="btt-container sg-header-inner">
          <div className="min-w-0 flex-1">{brand}</div>
          <div className="sg-nav-row__right shrink-0">
            {trailing}
            <button
              type="button"
              className="sg-nav-close-btn"
              aria-expanded={isMenuOpen}
              aria-controls="sg-kinetic-menu"
              onClick={toggleMenu}
            >
              <div className="sg-menu-button-text">
                <p className="sg-p-large">{isMenuOpen ? closeLabel : menuLabel}</p>
              </div>
              <div className="sg-icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="sg-menu-button-icon"
                  aria-hidden
                >
                  <path
                    d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <section className="sg-fullscreen-menu-container" aria-hidden={!isMenuOpen}>
        <div data-nav="closed" className="sg-nav-overlay-wrapper">
          <div className="sg-overlay" onClick={closeMenu} aria-hidden />
          <nav id="sg-kinetic-menu" className="sg-menu-content" aria-label="Main">
            <div className="sg-menu-bg">
              <div className="sg-backdrop-layer sg-first" />
              <div className="sg-backdrop-layer sg-second" />
              <div className="sg-backdrop-layer sg-third" />
              <AmbientShapes />
            </div>

            <div className="sg-menu-content-wrapper">
              <ul className="sg-menu-list">
                {links.map((item, i) => {
                  const shape = (i % 5) + 1;
                  const fade = i === 3;
                  return (
                    <li key={item.href} className="sg-menu-list-item" data-shape={String(shape)}>
                      <Link
                        href={item.href}
                        className="sg-nav-link"
                        onClick={closeMenu}
                      >
                        <p
                          className="sg-nav-link-text"
                          {...(fade ? { "data-menu-fade": "" } : {})}
                        >
                          {item.label}
                        </p>
                        <div className="sg-nav-link-hover-bg" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
