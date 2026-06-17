import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal, Code, Cpu, ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <Zap className="mr-2 h-4 w-4" />
            La Technologie en Mouvement
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            From Zero to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Software Engineer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A structured, 5-week journey to build your first web application. 
            No IT background required. We guide you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8" asChild>
              <Link href="/sign-up">
                Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8" asChild>
              <Link href="/courses">
                View Curriculum
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why NexaTech?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed specifically for beginners, combining theory with hands-on practice in a supportive environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-muted-foreground">Write code directly in your browser. Get instant feedback and hints when you get stuck.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-world Projects</h3>
              <p className="text-muted-foreground">Don't just learn syntax. Build actual web applications that you can show to employers.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Path</h3>
              <p className="text-muted-foreground">A carefully designed 5-week curriculum that prevents overwhelm and builds confidence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}