import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/OurProject.css";
import ProjectImage from "../../assets/FUREEVERCARE.png";

gsap.registerPlugin(ScrollTrigger);

const OurProject = () => {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const frame = frameRef.current;

      gsap.from(".project_heading", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".project_meta", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        frame,
        {
          scaleX: 1,
          scaleY: 1,
        },
        {
          scaleX: 0.86,
          scaleY: 0.97,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            end: "bottom 35%",
            scrub: 1.2,
          },
        }
      );

      gsap.from(".project_cta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: frame,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(
      ProjectImage,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
      }
    );

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          canvas.clientWidth,
          canvas.clientHeight
        ),
      },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uHover;
        uniform vec2 uMouse;

        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;

          float distanceFromMouse = distance(uv, uMouse);

          float influence = smoothstep(
            0.45,
            0.0,
            distanceFromMouse
          );

          float waveX = sin(uv.y * 12.0 + uTime * 0.8) * 0.003;
          float waveY = cos(uv.x * 10.0 + uTime * 0.6) * 0.003;

          vec2 distortion = vec2(waveX, waveY);

          distortion += (uMouse - uv) * influence * 0.025 * uHover;

          uv += distortion;

          vec4 color = texture2D(uTexture, uv);

          gl_FragColor = color;
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const mouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = 1 - (event.clientY - rect.top) / rect.height;

      gsap.to(uniforms.uMouse.value, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });

      gsap.to(uniforms.uHover, {
        value: 1,
        duration: 0.4,
        overwrite: true,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(uniforms.uHover, {
        value: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let animationFrame;

    const animate = (time) => {
      uniforms.uTime.value = time * 0.001;

      renderer.render(scene, camera);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    const handleResize = () => {
      renderer.setSize(
        canvas.clientWidth,
        canvas.clientHeight,
        false
      );

      uniforms.uResolution.value.set(
        canvas.clientWidth,
        canvas.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);

      canvas.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      canvas.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="our_project" ref={sectionRef}>
      <div className="project_heading">
        <span className="project_eyebrow">
          <i></i>
          OUR JOURNEY · 06
        </span>

        <h2>
          OUR <span> TICKET TO TECHWIZ</span> PROJECT
        </h2>

        <p>
          FROM AN IDEA TO SOMETHING REAL.
        </p>
      </div>

      <div className="project_layout">
        <div className="project_meta project_meta_left">
          <div>
            <span>PROJECT NAME</span>
            <p>FURE EVER CARE</p>
          </div>

          <div>
            <span>PROBLEM</span>
            <p>
              Creating a modern and interactive digital
              experience that feels simple and intelligent.
            </p>
          </div>

          <div>
            <span>SOLUTION</span>
            <p>
              A voice-powered web assistant designed to
              interact naturally with users.
            </p>
          </div>
        </div>

        <div className="project_showcase">
          <div
            className="project_frame"
            ref={frameRef}
          >
            <canvas
              ref={canvasRef}
              className="project_canvas"
            />

            <div className="project_overlay">
              <span>01 / PROJECT</span>

              <h3>
                FUR EVER CARE 
                <br />
                <em>VOICE ASSISTANT</em>
              </h3>

              <p>
                An interactive voice assistant built for
                the Techwiz challenge.
              </p>
            </div>

            <a
              href="furcare2.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="project_button"
            >
              EXPLORE PROJECT
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="project_meta project_meta_right">
          <div>
            <span>TECHNOLOGIES</span>
            <p>
              React
              <br />
              JavaScript
              <br />
              Three.js
              <br />
              GSAP
              <br />
              GLSL
            </p>
          </div>

          <div>
            <span>OUR CONTRIBUTION</span>
            <p>
              We worked on the frontend, interface,
              interactions and overall experience of
              the project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProject;