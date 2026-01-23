import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: January 18, 2026
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using Shrink Wrap, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    2. Description of Service
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Shrink Wrap provides image and video compression services. We offer both free and paid tiers with different features and usage limits. The specific features and limitations of each tier are described on our pricing page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    3. User Accounts
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To access certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    4. Acceptable Use
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree not to use the service to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Upload or compress illegal, harmful, or offensive content</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the intellectual property rights of others</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    5. Payment and Subscriptions
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Pro subscriptions are billed monthly. You may cancel your subscription at any time, but no refunds will be provided for the current billing period. We reserve the right to change our pricing with reasonable notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    6. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain all rights to the files you upload. By using our service, you grant us a limited license to process your files for the purpose of providing the compression service. We do not claim any ownership of your content.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    7. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Shrink Wrap is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to data loss, service interruptions, or any indirect or consequential damages.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    8. Changes to Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    9. Contact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms of Service, please contact us at legal@shrinkwrap.app.
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

export default Terms;
