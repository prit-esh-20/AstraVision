import React, { useEffect, useRef } from 'react';

const NeuralBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Adaptive particle count based on screen size
        const getParticleCount = () => {
            const area = window.innerWidth * window.innerHeight;
            const baseCount = Math.floor(area / 20000); // 1 per 20k pixels
            const isMobile = window.innerWidth < 1024;
            const min = isMobile ? 30 : 70;
            const max = isMobile ? 50 : 100; // Limit node count (70–100 max desktop)
            return Math.min(Math.max(baseCount, min), max);
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            pulse: number;
            pulseSpeed: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                // Exceptionally slow movement for professional look
                this.vx = (Math.random() - 0.5) * 0.12;
                this.vy = (Math.random() - 0.5) * 0.12;
                this.radius = Math.random() * 1.5 + 0.5;
                this.pulse = Math.random() * Math.PI;
                this.pulseSpeed = 0.005 + Math.random() * 0.01;
            }

            update(w: number, h: number) {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += this.pulseSpeed;

                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const pOpacity = 0.4 + Math.sin(this.pulse) * 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                // Cyan / Electric Blue nodes
                ctx.fillStyle = `rgba(0, 240, 255, ${pOpacity})`;
                ctx.fill();

                if (this.radius > 1.2) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "rgba(0, 163, 255, 0.6)"; // Electric Blue glow
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        const init = () => {
            if (!canvas) return;
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const lineOpacity = (1 - distance / 150) * 0.4;
                        // Cyan / Electric Blue lines
                        ctx.strokeStyle = `rgba(0, 240, 255, ${lineOpacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx);
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="neural-background"
            className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
            style={{
                zIndex: -1,
                opacity: 0.25, // Increased opacity for better visibility
                background: '#050b14', // Specific dark base background requested
                backgroundImage: 'none' // Ensure No grid pattern
            }}
        />
    );
};

export default NeuralBackground;
