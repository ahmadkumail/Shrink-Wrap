import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: January 18, 2026
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, upload files for compression, or contact us for support. This may include your name, email address, and any files you upload for processing.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process and complete file compression requests</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. File Storage and Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your uploaded files are processed on secure servers and are automatically deleted after compression is complete and you have downloaded the result. We do not store your files permanently, and we do not access or view the contents of your files except as necessary to provide the compression service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Data Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Cookies
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies to enhance your experience on our site. You can choose to disable cookies through your browser settings, though this may limit some functionality of our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at privacy@shrinkwrap.app.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
