import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create nodes - balanced visibility
    const nodes: Node[] = [];
    const nodeCount = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 8000));
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 3 + 2, // 2-5px
        opacity: Math.random() * 0.4 + 0.3 // 30-70% opacity
      });
    }

    // Animation loop
    let animationFrameId: number;

    const draw = () => {
      if (!ctx) return;

      // Clear with dark background instead of transparent
      ctx.fillStyle = '#0B0F17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect nodes that are close - clear visibility
          if (distance < 180) { // Good connection distance
            const opacity = Math.max(0.2, (1 - distance / 180) * 0.6); // Minimum 20% opacity
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 1.5; // Clear line width
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Draw node glow - clear visibility
        const gradient = ctx.createRadialGradient(
          nodes[i].x, 
          nodes[i].y, 
          0, 
          nodes[i].x, 
          nodes[i].y, 
          nodes[i].radius * 4
        );
        
        gradient.addColorStop(0, `rgba(0, 240, 255, ${Math.min(1, nodes[i].opacity * 0.8)})`);
        gradient.addColorStop(0.7, `rgba(0, 240, 255, ${Math.min(1, nodes[i].opacity * 0.4)})`);
        gradient.addColorStop(1, `rgba(0, 240, 255, 0)`);

        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core dot - clearly visible
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.min(1, nodes[i].opacity * 2)})`;
        ctx.fill();
        
        // Move node
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;

        // Boundary checks - wrap around
        if (nodes[i].x < 0) nodes[i].x = canvas.width;
        if (nodes[i].x > canvas.width) nodes[i].x = 0;
        if (nodes[i].y < 0) nodes[i].y = canvas.height;
        if (nodes[i].y > canvas.height) nodes[i].y = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: '#0B0F17' }}
    />
  );
};

export default NeuralNetworkBackground;