"use client";

import { useEffect } from "react";

const ASPIRE_BOOKING_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzYVmCTk0jBE4ItdW9WtgfqyyZN4rxrcNzJBnf0KMr3966kD0MTFu-EI2ejwIcex2jg/exec";

export default function Home() {
  // const year = new Date().getFullYear();
  const year = "2026";
  useEffect(() => {
    const brandCursor = document.querySelector(".brand-cursor");

    if (brandCursor && window.matchMedia("(pointer: fine)").matches) {
      const pointerMove = (event) => {
        brandCursor.style.left = `${event.clientX}px`;
        brandCursor.style.top = `${event.clientY}px`;
        brandCursor.classList.add("visible");
      };
      const hideCursor = () => brandCursor.classList.remove("visible");
      const showCursor = () => brandCursor.classList.add("visible");
      const pressCursor = () => brandCursor.classList.add("pressed");
      const releaseCursor = () => brandCursor.classList.remove("pressed");

      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerleave", hideCursor);
      document.addEventListener("pointerenter", showCursor);
      document.addEventListener("pointerdown", pressCursor);
      document.addEventListener("pointerup", releaseCursor);

      return () => {
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerleave", hideCursor);
        document.removeEventListener("pointerenter", showCursor);
        document.removeEventListener("pointerdown", pressCursor);
        document.removeEventListener("pointerup", releaseCursor);
      };
    }

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window) {
      const nodes = document.querySelectorAll(
        ".hero-copy, .hero-visual, .lesson-card, .card, .about-grid, .review-card, .booking-form, .cta, .availability-card, .site-footer"
      );

      if (nodes.length) {
        const style = document.createElement("style");
        style.textContent =
          ".aspire-reveal-ready{opacity:0;transform:translateY(30px) scale(.98);filter:blur(2px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.25,1),filter .8s ease}.aspire-reveal-ready.aspire-revealed{opacity:1;transform:none;filter:none}";
        document.head.appendChild(style);

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("aspire-revealed");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
        );

        nodes.forEach((node) => {
          node.classList.add("aspire-reveal-ready");
          observer.observe(node);
        });
      }
    }

    const form = document.getElementById("aspire-booking-form");
    if (!form) return;

    const contactSelect = form.querySelector('[name="contactPreference"]');
    const emailInput = form.querySelector('[name="customerEmail"]');
    const instagramInput = form.querySelector('[name="instagramHandle"]');

    const updateContactFields = () => {
      if (emailInput) {
        emailInput.required = !!(contactSelect && contactSelect.value === "Email");
      }

      if (instagramInput) {
        instagramInput.required = !!(contactSelect && contactSelect.value === "Instagram DM");
      }
    };

    if (contactSelect) {
      contactSelect.addEventListener("change", updateContactFields);
      updateContactFields();
    }

    let status = form.querySelector(".booking-save-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "booking-save-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.style.cssText =
        "margin-top:12px;padding:12px 14px;border-radius:6px;font-weight:700;display:none";
      form.appendChild(status);
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const data = new FormData(form);
      const booking = {
        name: (data.get("name") || "").toString().trim(),
        phone: (data.get("phone") || "").toString().trim(),
        email: (data.get("customerEmail") || "").toString().trim(),
        instagramHandle: (data.get("instagramHandle") || "").toString().trim(),
        lesson: (data.get("lesson") || "").toString(),
        day: (data.get("day") || "").toString(),
        time: (data.get("time") || "").toString(),
        notes: (data.get("notes") || "").toString(),
        contactPreference: (data.get("contactPreference") || "").toString(),
        submittedAt: new Date().toISOString(),
        source: "Aspire Driving School website",
      };

      if (ASPIRE_BOOKING_ENDPOINT === "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
        status.textContent =
          "The form is ready, but it is not connected to Gaurav yet. The website owner must finish the one-time Google Apps Script setup before requests can be delivered. No message has been sent.";
        status.style.background = "#fff4d6";
        status.style.color = "#704d00";
        status.style.display = "block";
        return;
      }

      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = "Submitting…";
      status.style.display = "none";

      try {
        await fetch(ASPIRE_BOOKING_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(booking),
        });

        form.reset();
        status.textContent =
          "Thanks! Your request has been sent from this page. Gaurav will follow up using your chosen contact method. This is a request, not a confirmed lesson.";
        status.style.background = "#e8f7ee";
        status.style.color = "#14532d";
        status.style.display = "block";
      } catch (error) {
        status.textContent =
          "Sorry, we couldn't send your request. Please try again in a moment or contact Aspire Driving School directly.";
        status.style.background = "#fff4d6";
        status.style.color = "#704d00";
        status.style.display = "block";
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
      if (contactSelect) {
        contactSelect.removeEventListener("change", updateContactFields);
      }
    };
  }, []);

  return (
    <>
      <div className="brand-cursor" aria-hidden="true">
        <img src="/aspire.jpg" alt="" />
      </div>

      <header>
        <div className="wrap">
          <nav aria-label="Main navigation">
            <a className="brand" href="#home">
              <img alt="Aspire Driving School logo" src="/aspire.jpg" />
              <span>
                ASPIRE
                <small>DRIVING SCHOOL · CANBERRA</small>
              </span>
            </a>
            <div className="navlinks">
              <a href="#pricing">Lessons</a>
              <a href="#about">About</a>
              <a href="#why">Why Aspire</a>
              <a href="#reviews">Reviews</a>
              <a className="btn" href="#book">
                Book a lesson ↗
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Driving lessons in Canberra</div>
              <h1>
                Your journey to driving <em>confidence</em> starts here.
              </h1>
              <p>
                Friendly, learner-focused lessons with Gaurav Arora. Build practical skills, learn at your own pace and
                grow more confident behind the wheel.
              </p>
            </div>
            <div className="hero-visual" aria-label="Aspire Driving School lesson information">
              <div className="hero-photo" role="img" aria-label="A car on a scenic road at sunset" />
              <div className="hero-confidence">
                Learn
                <br />
                with
                <br />
                confidence
              </div>
              <div className="hero-price">
                <strong>Lessons from $90</strong>
                <span>Contact Gaurav to check availability</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing" aria-labelledby="pricing-title">
          <div className="wrap pricing-wrap">
            <div className="pricing-intro">
              <div className="eyebrow">Aspire Driving School · Canberra</div>
              <h2 id="pricing-title">The right lesson. The right price.</h2>
              <p>Clear, competitive pricing for calm, one-on-one instruction in an automatic vehicle.</p>
            </div>

            <div className="pricing-block">
              <div className="pricing-block-heading">
                <div>
                  <span className="pricing-kicker">Start with a lesson</span>
                  <h3>Driving lessons</h3>
                </div>
                <span className="pricing-note">
                  Automatic vehicle <span aria-hidden="true">·</span> One-on-one instruction
                </span>
              </div>
              <div className="lesson-rate-grid">
                <article className="lesson-rate">
                  <span>60-minute lesson</span>
                  <strong>$90</strong>
                </article>
                <article className="lesson-rate">
                  <span>90-minute lesson</span>
                  <strong>$130</strong>
                </article>
                <article className="lesson-rate">
                  <span>2-hour lesson</span>
                  <strong>$175</strong>
                </article>
              </div>
            </div>

            <div className="pricing-block">
              <div className="pricing-block-heading">
                <div>
                  <span className="pricing-kicker">Build skills as you go</span>
                  <h3>Lesson packages</h3>
                </div>
                <p className="pricing-note">Save with a multi-lesson plan</p>
              </div>
              <div className="package-grid">
                <article className="package-card">
                  <img className="package-image" src="/aspire1.jpg" alt="Learner driver practising with an instructor" loading="lazy" decoding="async" />
                  <h4>Starter Package</h4>
                  <p className="package-lessons">3 lessons</p>
                  <strong className="package-price">$255</strong>
                  <p className="package-rate">$85 per lesson</p>
                  <p className="package-description">Build your basic driving skills.</p>
                </article>
                <article className="package-card package-featured">
                  <span className="package-badge">Most popular</span>
                  <img className="package-image" src="/aspire2.jpg" alt="Learner driver building confidence behind the wheel" loading="lazy" decoding="async" />
                  <h4>Confidence Builder</h4>
                  <p className="package-lessons">5 lessons</p>
                  <strong className="package-price">$425</strong>
                  <p className="package-rate">$85 per lesson</p>
                  <p className="package-description">Drive with confidence.</p>
                </article>
                <article className="package-card package-best-value">
                  <span className="package-badge">Best value</span>
                  <img className="package-image" src="/aspire3.jpg" alt="Car on the road during a driving lesson" loading="lazy" decoding="async" />
                  <h4>Road Ready</h4>
                  <p className="package-lessons">10 lessons</p>
                  <strong className="package-price">$820</strong>
                  <p className="package-rate">$82 per lesson</p>
                  <p className="package-description">Be fully prepared for the road.</p>
                </article>
                <article className="package-card">
                  <img className="package-image" src="/aspire4.jpg" alt="Car used for a complete driving course" loading="lazy" decoding="async" />
                  <h4>Complete Driving</h4>
                  <p className="package-lessons">15 lessons</p>
                  <strong className="package-price">$1,200</strong>
                  <p className="package-rate">$80 per lesson</p>
                  <p className="package-description">Your complete driving journey.</p>
                </article>
              </div>
            </div>

            <div className="pricing-block">
              <div className="pricing-block-heading">
                <div>
                  <span className="pricing-kicker">Focused support for your next step</span>
                  <h3>Specialist packages</h3>
                </div>
              </div>
              <div className="specialist-grid">
                <article className="specialist-card">
                  <img src="/aspire1.jpg" alt="Learner practising logbook driving skills" loading="lazy" decoding="async" />
                  <div>
                    <h4>ACT Logbook Training</h4>
                    <p>10 lessons · CBT&amp;A training</p>
                  </div>
                  <strong>$820</strong>
                </article>
                <article className="specialist-card">
                  <img src="/aspire2.jpg" alt="Driver practising for an overseas licence conversion" loading="lazy" decoding="async" />
                  <div>
                    <h4>Overseas Licence Conversion</h4>
                    <p>3 lessons</p>
                  </div>
                  <strong>$270</strong>
                </article>
                <article className="specialist-card">
                  <img src="/aspire3.jpg" alt="Learner preparing for a practical driving test" loading="lazy" decoding="async" />
                  <div>
                    <h4>Test Preparation</h4>
                    <p>2 lessons</p>
                  </div>
                  <strong>$175</strong>
                </article>
                <article className="specialist-card">
                  <img src="/aspire4.jpg" alt="Car used for final practical test preparation" loading="lazy" decoding="async" />
                  <div>
                    <h4>Final Test Preparation</h4>
                    <p>3 lessons</p>
                  </div>
                  <strong>$255</strong>
                </article>
              </div>
              <p className="pricing-disclaimer">
                ACT CBT&amp;A is provided as training. Competency sign-offs are based on assessment and are not guaranteed.
              </p>
            </div>

            <div className="pricing-extras">
              <article className="test-ready-card">
                <div className="test-ready-copy">
                  <span className="offer-label">Featured offer</span>
                  <span className="pricing-kicker">Training + test-day vehicle</span>
                  <h3>Driving Test Ready Package</h3>
                  <strong className="offer-price">$350</strong>
                  <p>2 hours of training plus practical test vehicle hire.</p>
                  <a className="btn" href="#book">
                    Book your test preparation <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <ul className="offer-inclusions">
                  <li>Two hours of pre-test training</li>
                  <li>Driving manoeuvres and test preparation</li>
                  <li>Instructor feedback</li>
                  <li>Dual-control vehicle for the practical test</li>
                </ul>
              </article>

              <article className="additional-services">
                <div className="additional-heading">
                  <span className="pricing-kicker">Make it work for you</span>
                  <h3>Additional services</h3>
                </div>
                <dl className="additional-list">
                  <div>
                    <dt>
                      Night Driving <span>(60 min)</span>
                    </dt>
                    <dd>$100</dd>
                  </div>
                  <div>
                    <dt>
                      Night Driving <span>(5 hours)</span>
                    </dt>
                    <dd>$475</dd>
                  </div>
                  <div>
                    <dt>
                      Refresher Lesson <span>(60 min)</span>
                    </dt>
                    <dd>$90</dd>
                  </div>
                  <div>
                    <dt>
                      Pre-Test Warm-Up <span>(60 min)</span>
                    </dt>
                    <dd>$90</dd>
                  </div>
                  <div>
                    <dt>Test Vehicle Hire Only</dt>
                    <dd>$195</dd>
                  </div>
                </dl>
              </article>
            </div>
            <p className="test-terms">
              Test booking fee is not included. Test-day vehicle hire duration, availability, hire conditions and any
              additional charges will be confirmed before booking.
            </p>

            <aside className="launch-note">
              <span className="launch-mark" aria-hidden="true">
                ✓
              </span>
              <p>
                <strong>Launch pricing, kept simple.</strong> The 5-lesson Confidence Builder is our featured starter offer;
                Road Ready is our best-value package. No further discounts at launch. We’ll review prices after our first 20
                paying customers.
              </p>
            </aside>
          </div>
        </section>

        <section className="about" id="about">
          <div className="wrap about-grid">
            <div className="about-art">
              <img alt="Aspire Driving School logo" src="/aspire.jpg" />
            </div>
            <div className="about-copy">
              <div className="eyebrow">Meet your instructor</div>
              <h2>Learn with Gaurav Arora.</h2>
              <p>
                Aspire Driving School focuses on helping learners become safe, capable and confident drivers through
                practical, supportive lessons around Canberra.
              </p>
              <ul className="checks">
                <li>A welcoming approach for learners</li>
                <li>Lessons shaped around your experience level</li>
                <li>Practical learning in a Suzuki Swift</li>
                <li>Driving lessons available across Canberra</li>
                <li>Contact Gaurav directly to arrange a lesson</li>
              </ul>
              <a className="btn blue" href="https://wa.me/61414194094" rel="noopener" target="_blank">
                Get in touch ↗
              </a>
            </div>
          </div>
        </section>

        <section className="why" id="why">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">The Aspire approach</div>
              <h2>Why learn with Aspire?</h2>
              <p>
                Good lessons are about more than getting from A to B. They help you feel prepared to make safe decisions on
                the road.
              </p>
            </div>
            <div className="grid3">
              <article className="card">
                <div className="icon">🤝</div>
                <h3>Supportive Learning</h3>
                <p>Take lessons at a pace that suits your current confidence and experience.</p>
              </article>
              <article className="card">
                <div className="icon">🧭</div>
                <h3>Practical Experience</h3>
                <p>Build useful skills through hands-on practice and clear guidance.</p>
              </article>
              <article className="card">
                <div className="icon">📍</div>
                <h3>Across All of Canberra</h3>
                <p>We provide driving lessons across Canberra, ACT. Get in touch to arrange a lesson in your area.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="languages" id="languages">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Friendly communication</div>
              <h2>Learn in the language you’re comfortable with.</h2>
              <p>
                We can communicate with learners in English, Hindi and Punjabi to help make lessons and instructions easier
                to understand.
              </p>
            </div>
            <div className="grid3">
              <article className="card language-card">
                <div aria-hidden="true" className="icon language-mark">
                  EN
                </div>
                <h3>English</h3>
                <p>Driving lessons and guidance in English.</p>
              </article>
              <article className="card language-card">
                <div aria-hidden="true" className="icon language-mark">
                  हि
                </div>
                <h3>
                  Hindi <span lang="hi">हिन्दी</span>
                </h3>
                <p>Driving guidance available in Hindi.</p>
              </article>
              <article className="card language-card">
                <div aria-hidden="true" className="icon language-mark">
                  ਪੰ
                </div>
                <h3>
                  Punjabi <span lang="pa">ਪੰਜਾਬੀ</span>
                </h3>
                <p>Driving guidance available in Punjabi.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="reviews" id="reviews">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Learner feedback</div>
              <h2>Your experience matters.</h2>
              <p>
                We’re building our collection of learner reviews. If you’ve had a lesson with Gaurav, share your honest
                feedback.
              </p>
            </div>
            <div className="review-card">
              <div aria-label="Five star symbol" className="stars">
                ★★★★★
              </div>
              <h3>Have you learned with Aspire?</h3>
              <p>Your feedback can help other learners understand what lessons are like.</p>
              <a
                className="btn blue"
                href="https://wa.me/61414194094?text=Hi%20Gaurav%2C%20I%27d%20like%20to%20share%20feedback%20about%20my%20driving%20lesson."
                rel="noopener"
                target="_blank"
              >
                Share your feedback
              </a>
            </div>
          </div>
        </section>

        <section className="booking-section" id="book">
          <div className="wrap booking-grid">
            <div>
              <div className="eyebrow">Your next step starts here</div>
              <h2>Book your lesson.</h2>
              <p className="booking-intro">
                Tell us what lesson you need and when you prefer. Submit this form right here—no WhatsApp, email app, or
                other app will open. Once connected, your request is emailed directly to Gaurav at Aspire Driving School.
              </p>
              <div className="booking-points">
                <span>✓ Friendly, learner-focused lessons</span>
                <span>✓ Lesson times arranged directly with Gaurav</span>
                <span>✓ Driving lessons across all of Canberra, ACT</span>
              </div>
            </div>

            <form className="booking-form" id="aspire-booking-form">
              <h3>Request a lesson</h3>
              <p>
                Tell us what you need and your preferred contact method. We’ll follow up to confirm availability. A request is
                not a confirmed lesson.
              </p>
              <div className="booking-fields">
                <label>
                  Your name
                  <input autoComplete="name" name="name" placeholder="Full name" required />
                </label>
                <label>
                  Phone number
                  <input autoComplete="tel" name="phone" placeholder="Your contact number" required type="tel" />
                </label>
                <label>
                  Email address <span>(if choosing email)</span>
                  <input autoComplete="email" name="customerEmail" placeholder="you@example.com" type="email" />
                </label>
                <label>
                  Instagram username <span>(if choosing Instagram)</span>
                  <input name="instagramHandle" placeholder="@yourusername" type="text" />
                </label>
                <label>
                  Lesson type
                  <select name="lesson" required>
                    <option value="" disabled selected>
                      Choose a lesson
                    </option>
                    <option>Beginner lesson</option>
                    <option>Driving skills practice</option>
                    <option>Test preparation</option>
                    <option>Refresher lesson</option>
                    <option>Logbook practice</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label>
                  Preferred day
                  <input name="day" placeholder="e.g. Saturday" type="text" />
                </label>
                <label className="full">
                  Preferred time
                  <input name="time" placeholder="e.g. Morning or after 3 pm" type="text" />
                </label>
                <label className="full">
                  Anything else?
                  <textarea name="notes" placeholder="Your experience level or skills you want to practise" />
                </label>
                <label className="full">
                  How would you prefer us to contact you?
                  <select name="contactPreference" required>
                    <option value="" disabled selected>
                      Choose a contact method
                    </option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="Either WhatsApp or email">Either WhatsApp or email</option>
                  </select>
                </label>
              </div>
              <button className="btn" type="submit">
                Send Request to Gaurav
              </button>
              <p className="booking-note">
                Submitting sends a booking request, not a confirmed appointment. Gaurav will confirm availability with you.
              </p>
            </form>
          </div>
        </section>

        <section className="cta-section" id="contact">
          <div className="wrap">
            <div className="cta">
              <div>
                <div className="eyebrow">Ready to get started?</div>
                <h2>Let’s get you more confident behind the wheel.</h2>
                <p>Message Gaurav to ask about lessons, availability and getting started with Aspire Driving School.</p>
              </div>
              <div className="contact-actions">
                <a className="btn" href="https://wa.me/61414194094" rel="noopener" target="_blank">
                  WhatsApp · 0414 194 094
                </a>
                <a className="btn white" href="tel:+61414194094">
                  Call Gaurav
                </a>
                <a className="btn white" href="mailto:aspiredrivingschool.au@gmail.com">
                  Email Gaurav
                </a>
                <a className="btn white" href="https://www.instagram.com/aspiredrivingschool.au/" target="_blank" rel="noopener noreferrer">
                  Instagram · @aspiredrivingschool.au
                </a>
                <a className="btn white" href="https://youtube.com/@aspiredrivingschool-r8o?si=6Uh-ABT2wEe47NoY" target="_blank" rel="noopener noreferrer">
                  YouTube · Aspire Driving School
                </a>
                <a className="btn white" href="https://www.facebook.com/share/1JkEPJadbo/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                  Facebook · Aspire Driving School
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="hours" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Plan a lesson</div>
              <h2>Lesson availability</h2>
              <p>Contact Gaurav directly to confirm available times.</p>
            </div>
            <div className="grid3">
              <article className="card">
                <h3>Monday – Friday</h3>
                <p>7:00 am – 2:00 pm</p>
              </article>
              <article className="card">
                <h3>Saturday</h3>
                <p>8:00 am – 9:00 pm</p>
              </article>
              <article className="card">
                <h3>Sunday</h3>
                <p>7:00 am – 2:00 pm</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-row footer-row-top">
            <div className="footer-brand-wrap">
              <span className="footer-brand">ASPIRE DRIVING SCHOOL · GAURAV ARORA</span>
            </div>
            <div className="footer-meta-wrap">
              <span className="footer-meta">Languages · English, Hindi &amp; Punjabi</span>
              <span className="footer-meta">Driving lessons across Canberra, Australian Capital Territory</span>
              <a href="https://www.instagram.com/aspiredrivingschool.au/" target="_blank" rel="noopener noreferrer">
                Instagram · @aspiredrivingschool.au
              </a>
            </div>
          </div>

          <div className="footer-row footer-row-bottom">
            <a href="https://youtube.com/@aspiredrivingschool-r8o?si=6Uh-ABT2wEe47NoY" target="_blank" rel="noopener noreferrer">
              YouTube · Aspire Driving School
            </a>
            <span>
              © <span id="year">{year}</span> Aspire Driving School
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
