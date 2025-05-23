import { useState, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'

function App() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setIsSubmitting(true);

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const templateParams = {
        email: email,
        name: email.split('@')[0],
        message: 'Thank you for subscribing to our launch notification!'
      };

      console.log('Sending email with params:', templateParams); // Debug log

      const response = await emailjs.send(
        'service_37e1cra',
        'template_hhsqzej',
        templateParams,
        'FoTMJ0oUa1t63kmbW'
      );

      console.log('EmailJS Response:', response); // Debug log

      alert('Thank you for subscribing! We will notify you when we launch.');
      setEmail('');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setEmailError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="coming-soon">
      <div className="content">
        <div className="logo-container">
          {/* Add your logo here */}
          <img src="/my-logo.png" alt="Brand Logo" className="logo" />
        </div>

        <h1>Coming Soon</h1>
        <p className="tagline">Elevate Your Style</p>

        <form onSubmit={handleSubmit} className="subscribe-form">
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={emailError ? 'error' : ''}
              disabled={isSubmitting}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Notify Me'}
          </button>
        </form>

        <div className="social-links">
          <a href="https://www.instagram.com/illusion.leb?igsh=MW8xM2ViMTgwYmpsdg%3D%3D&utm_source=qr" className="social-link">Instagram</a>
          <a href="https://www.facebook.com/share/16YqstRy9c/?mibextid=wwXIfr" className="social-link">Facebook</a>
        </div>
      </div>
    </div>
  )
}

export default App
