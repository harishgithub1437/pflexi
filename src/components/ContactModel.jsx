import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import "../styles/ContactModel.css";

const ContactModel = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    type: "",
    source: "Quick Contact Form",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  // Initialize modal on component mount
  useEffect(() => {
    const modalEl = document.getElementById("demoFormModal");
    if (!modalEl) return;
    
    modalRef.current = modalEl;
    
    // Initialize modal only once
    if (!modalInstance.current) {
      modalInstance.current = new Modal(modalEl, {
        backdrop: 'static',
        keyboard: true
      });
    }
    
    // Handle modal hidden event to reset form
    const handleHidden = () => {
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        company_name: "",
        type: "",
        source: "Quick Contact Form",
      });
      setSubmitStatus("");
      setIsSubmitting(false);
    };
    
    modalEl.addEventListener('hidden.bs.modal', handleHidden);
    
    // Cleanup on unmount
    return () => {
      modalEl.removeEventListener('hidden.bs.modal', handleHidden);
      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }
    };
  }, []);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);

    setFormData({ ...formData, phone_number: value });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "phone_number") return;
    setFormData({ ...formData, [id]: value });
  };

  const toUrlEncoded = (obj) =>
    Object.keys(obj)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
      .join("&");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    // Basic validation
    if (formData.full_name.length < 2 || formData.full_name.length > 50) {
      setSubmitStatus("Full name must be between 2 and 50 characters.");
      setIsSubmitting(false);
      return;
    }

    if (formData.phone_number.length !== 10) {
      setSubmitStatus("Phone number must be exactly 10 digits.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        type: formData.type,
        company_name: formData.company_name,

        utm_source: localStorage.getItem("utm_source"),
        utm_medium: localStorage.getItem("utm_medium"),
        utm_campaign: localStorage.getItem("utm_campaign"),
        utm_term: localStorage.getItem("utm_term"),

        page_title: document.title,
        page_url: window.location.href,
      };

      await axios.post(
        "https://www.flexistore.in/api/popup-form.php",
        toUrlEncoded(payload),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // Hide modal using Bootstrap's hide method
      if (modalInstance.current) {
        modalInstance.current.hide();
      }

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        company_name: "",
        type: "",
        source: "Quick Contact Form",
      });
      
      setIsSubmitting(false);

      // Navigate to thank-you page
      navigate("/thank-you", { state: { formData } });

    } catch (error) {
      setSubmitStatus("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade strategy-modal"
      id="demoFormModal"
      tabIndex="-1"
      aria-labelledby="strategyCallModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable model-sm">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title" id="strategyCallModalLabel">
              Book a Free Strategy Call
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name*</label>
                <input
                  type="text"
                  className="form-control"
                  id="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Business Email*</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number*</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  maxLength="10"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="company_name"
                  placeholder="Company(optional)"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Business Type*</label>
                <select
                  className="form-select"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Select Business Type</option>
                  <option>B2B</option>
                  <option>B2C</option>
                  <option>B2B2C</option>
                  <option>OTHERS</option>
                </select>
              </div>

              {submitStatus && (
                <div className="alert alert-danger">{submitStatus}</div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Schedule My Free Call"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModel;
