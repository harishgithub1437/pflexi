import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "../styles/ContactUs.css";
import tempimg from "../assets/tempcontactimage.webp";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: ""
  });

  //  UPDATED — changed name → full_name 
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    company: "",
    message: "",
    howYouSell: "Starting a new business"
  });

  const navigate = useNavigate();

  // ========================= PHONE VALIDATION =========================
  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      phone: cleaned
    }));
  };

  // ========================= TEXT INPUT HANDLER =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ UPDATED — full_name validation logic
    if (name === "full_name") {
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, full_name: value }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ========================= SUBMIT FORM =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    // VALIDATION
    // ✅ UPDATED — full_name validation 
    if (formData.full_name.trim().length < 2) {
      return finishError("Full name must be at least 2 characters.");
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return finishError("Please enter a valid email address.");
    }

    if (formData.phone.length !== 10) {
      return finishError("Phone number must be exactly 10 digits.");
    }

    if (formData.city.trim().length < 2) {
      return finishError("City must be at least 2 characters.");
    }

    if (!formData.country) {
      return finishError("Please select a country.");
    }

    if (formData.message.trim().length < 5) {
      return finishError("Message should be at least 5 characters.");
    }

    try {
      // ========================= PAYLOAD =========================
      // ✅ UPDATED — unified full_name with modal form
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone,
        city: formData.city.trim(),
        country: formData.country.trim(),
        company_name: formData.company.trim(),
        message: formData.message.trim(),
        type: formData.howYouSell,

        // UTM Tracking
        utm_source: localStorage.getItem("utm_source"),
        utm_medium: localStorage.getItem("utm_medium"),
        utm_campaign: localStorage.getItem("utm_campaign"),
        utm_term: localStorage.getItem("utm_term"),

        // Page details
        page_title: document.title,
        page_url: window.location.href,
      };

      await axios.post(
        "https://www.flexistore.in/api/contact-form.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Navigate with FULL updated formData (Thank-you gets full_name)
      navigate("/thank-you", { state: { formData } });

    } catch (error) {
      return finishError("Something went wrong. Please try again.");
    }
  };

  // ========================= ERROR HANDLER =========================
  const finishError = (msg) => {
    setSubmitStatus({ success: false, message: msg });
    setIsSubmitting(false);
    return;
  };

  const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Nepal", "Bangladesh", "Sri Lanka", "China", "UAE",
    "Germany", "France", "Japan"
  ];

  return (
    <>
      {/* ================== SEO / META TAGS ================== */}
      <Helmet>
        <title>Contact Flexi Store | Book a Demo or Get Business Support</title>
        <meta
          name="description"
          content="Reach out to Flexi Store for demos, support, or business queries."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/contact" />
      </Helmet>

      {/* ================== PAGE CONTENT ================== */}
      <div className="contact-page">
        <section className="py-5 text-center bg-white">
          <div className="container">
            <h1 className="fw-bold mb-3">
              Get in <span className="gradiant-texts">Touch</span>
            </h1>
            <p className="text-muted mb-4 fs-5">
              Have questions? We're here to help! Reach out to our team for support.
            </p>
          </div>
        </section>

        <section className="bubble-bg-left position-relative contactform">
          <div className="container">
            <div className="row">

              {/* ---------- LEFT FORM ---------- */}
              <div className="col-lg-7 mb-5 mb-lg-0">
                <div className="contact-form-container p-4 p-md-5 shadow-sm rounded-4">
                  <h2 className="fw-bold mb-4">Send us a Message</h2>

                  {submitStatus.message && (
                    <Alert
                      variant={submitStatus.success ? "success" : "danger"}
                      className="mb-4"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {submitStatus.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>

                      {/* ======== UPDATED full_name input ======== */}
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="full_name"
                          placeholder="Full Name *"
                          required
                          className="form-control-lg"
                          value={formData.full_name}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email *"
                          required
                          className="form-control-lg"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Mobile Number *"
                          required
                          maxLength="10"
                          className="form-control-lg"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          disabled={isSubmitting}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="City *"
                          required
                          className="form-control-lg"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </Col>
                    </Row>

                    <Form.Select
                      required
                      name="country"
                      className="form-select-lg mb-3"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Country *</option>
                      {countries.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </Form.Select>

                    <Form.Control
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      className="form-control-lg mb-3"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />

                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      placeholder="How can we help you? *"
                      required
                      className="form-control-lg mb-4"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />

                    {/* Radio Buttons */}
                    <p className="fw-semibold mb-2">How You Sell?</p>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      {[
                        "Starting a new business",
                        "Taking existing business online",
                        "Already selling online"
                      ].map((item) => (
                        <Form.Check
                          key={item}
                          type="radio"
                          label={item}
                          name="howYouSell"
                          checked={formData.howYouSell === item}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              howYouSell: item
                            }))
                          }
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 py-3 fw-bold"
                      style={{
                        background: "var(--primary-gradient)",
                        border: "none"
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </Form>
                </div>
              </div>

              {/* ---------- RIGHT IMAGE ---------- */}
              <div className="col-lg-5">
                <img
                  src={tempimg}
                  className="img-fluid rounded-4"
                  alt="Contact Flexi Store"
                />
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;
