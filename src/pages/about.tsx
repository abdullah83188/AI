import { Card, CardContent } from "@/components/ui/card";

import photo_2025_07_14_13_34_58 from "@assets/photo_2025-07-14_13-34-58.jpg";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to my personal blog where I share insights about technology, AI, and software development.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                  <img 
                    src={photo_2025_07_14_13_34_58} 
                    alt="Mohammad Abdulla - Tech Enthusiast" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Hi, I'm Mohammad Abdulla!</h2>
                <p className="text-muted-foreground mb-4">Hey there, I’m Mohammad Abdulla, a tech enthusiast and AI lover on a mission to make the digital world fun, simple, and accessible for everyone. Welcome to my blog, where I unpack the latest in technology, artificial intelligence, and digital innovation — from smart AI tools and tech trends to practical tips for navigating the digital space.  Whether you’re a newbie curious about AI, a hustler looking to level up with tech, or just someone who geeks out over cutting-edge gadgets and ideas, I’ve got you covered. My goal? To break down complex tech topics into bite-sized, easy-to-grasp insights that spark excitement and inspire action.  Through this blog, I share my journey of exploring AI, tech tools, and the ever-evolving digital landscape, with a sprinkle of practical advice to help you stay ahead. Thanks for stopping by — let’s dive into the world of tech and grow together!</p>
                <p className="text-muted-foreground">
                  Whether you're a fellow developer, a tech enthusiast, or someone curious about the digital world, 
                  I hope you find value in the content I create here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">What I Write About</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Artificial Intelligence & Machine Learning</li>
              <li>• Web Development Trends</li>
              <li>• Software Engineering Best Practices</li>
              <li>• Technology Reviews & Insights</li>
              <li>• Programming Tutorials & Tips</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Let's Connect</h3>
            <p className="text-muted-foreground mb-4">
              I'm always excited to connect with fellow developers and tech enthusiasts. 
              Feel free to reach out if you'd like to collaborate or just have a chat about technology!
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/contact" className="text-primary hover:underline">Get in Touch</a>
              <span className="text-muted-foreground">•</span>
              <a href="https://github.com" className="text-primary hover:underline">GitHub</a>
              <span className="text-muted-foreground">•</span>
              <a href="https://twitter.com" className="text-primary hover:underline">Twitter</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}