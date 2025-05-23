"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Contact.module.css';
import axios from 'axios';
import  useAuthStore  from "../stores/authStore";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { user } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    
    try {
      // Simulate API call
      await axios.post("http://localhost:8000/student/report",{
        user_id:user.user_id,
        subject: formData.subject,
        content: formData.content
      });
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        subject: '',
        content: ''
      });
    } catch (error) {
      setSubmitMessage('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Kratos-University</title>
        <meta name="description" content="Get in touch with the Kratos-University team" />
      </Head>

      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1>Contact Us</h1>
          <p>Have questions or feedback? We'd love to hear from you.</p>
        </div>

        <div className={styles.contactContent}>
          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="content">Message</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div className={styles.submitMessage}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3>Contact Information</h3>
              <ul>
                <li>
                  <span className={styles.icon}>📍</span>
                  <span>123 Education Street, Learning City, 10101</span>
                </li>
                <li>
                  <span className={styles.icon}>📞</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <span className={styles.icon}>✉️</span>
                  <span>support@Kratos-University.com</span>
                </li>
              </ul>
            </div>

            <div className={styles.hoursCard}>
              <h3>Support Hours</h3>
              <ul>
                <li><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM</li>
                <li><strong>Saturday:</strong> 10:00 AM - 4:00 PM</li>
                <li><strong>Sunday:</strong> Closed</li>
              </ul>
            </div>

            <div className={styles.socialCard}>
              <h3>Connect With Us</h3>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>Twitter</a>
                <a href="#" className={styles.socialLink}>LinkedIn</a>
                <a href="#" className={styles.socialLink}>Facebook</a>
                <a href="#" className={styles.socialLink}>Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;