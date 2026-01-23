import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "SC",
    content: "Shrink Wrap has become an essential part of my workflow. I compress every image before deploying, and my sites load noticeably faster.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Content Creator",
    avatar: "MJ",
    content: "The video compression quality is impressive. I can share high-quality content without worrying about file size limits on social platforms.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    avatar: "ER",
    content: "Simple, fast, and effective. The before/after comparison gives me confidence that quality is preserved. Highly recommend!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by creators worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of designers, developers, and content creators who trust Shrink Wrap.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-6 bg-card rounded-2xl border border-border shadow-soft hover:shadow-card transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
