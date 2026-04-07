import styles from "../styles/RegisterForm.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    confirmpassword: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState({
    userName: false,
    email: false,
    password: false,
    confirmpassword: false
  });

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field, value) => {
    setFocused({ ...focused, [field]: value !== "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("/auth/regiter", user);
      if (res.data.status == 1) {
        Swal.fire({
          title: "Succès",
          text: res.data.msg,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate('/auth/login');
          window.location.reload();
        }, 2000);
      } else if (res.data.status == 0) {
        Swal.fire({
          title: "Erreur",
          text: res.data.msg,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#B58932",
        });
      } else {
        setError(res.data.validate_error);
        if (res.data.validate_error) {
          const errorMessages = Object.values(res.data.validate_error).flat();
          Swal.fire({
            title: "Champs invalides",
            html: errorMessages.join('<br>'),
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#B58932",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'inscription",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#B58932",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-overlay"></div>
      </div>
      
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <div className="logo-section">
              <img 
                src="/images/logo/logo.png" 
                alt="FinaPlus" 
                className="register-logo"
                  style={{ borderRadius:"100px" }}
              />
            </div>
            <h2 className="register-title">Créer un compte</h2>
            <p className="register-subtitle">Inscrivez-vous pour accéder à l'espace administration</p>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-icon">
                <i className="fas fa-user"></i>
              </div>
              <input
                type="text"
                className={`form-input ${error.userName ? 'error' : ''}`}
                name="userName"
                value={user.userName}
                onChange={(e) => setUser((p) => ({ ...p, userName: e.target.value }))}
                onFocus={() => handleFocus('userName')}
                onBlur={(e) => handleBlur('userName', e.target.value)}
                placeholder=" "
              />
              <label className={`floating-label ${focused.userName || user.userName ? 'active' : ''}`}>
                Nom d'utilisateur
              </label>
              {error.userName && <span className="error-message">{error.userName}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <input
                type="email"
                className={`form-input ${error.email ? 'error' : ''}`}
                name="email"
                value={user.email}
                onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))}
                onFocus={() => handleFocus('email')}
                onBlur={(e) => handleBlur('email', e.target.value)}
                placeholder=" "
              />
              <label className={`floating-label ${focused.email || user.email ? 'active' : ''}`}>
                Email
              </label>
              {error.email && <span className="error-message">{error.email}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <i className="fas fa-lock"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${error.password ? 'error' : ''}`}
                name="password"
                value={user.password}
                onChange={(e) => setUser((p) => ({ ...p, password: e.target.value }))}
                onFocus={() => handleFocus('password')}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder=" "
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <label className={`floating-label ${focused.password || user.password ? 'active' : ''}`}>
                Mot de passe
              </label>
              {error.password && <span className="error-message">{error.password}</span>}
            </div>

            <div className="form-group">
              <div className="input-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${error.confirmpassword ? 'error' : ''}`}
                name="confirmpassword"
                value={user.confirmpassword}
                onChange={(e) => setUser((p) => ({ ...p, confirmpassword: e.target.value }))}
                onFocus={() => handleFocus('confirmpassword')}
                onBlur={(e) => handleBlur('confirmpassword', e.target.value)}
                placeholder=" "
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <label className={`floating-label ${focused.confirmpassword || user.confirmpassword ? 'active' : ''}`}>
                Confirmez mot de passe
              </label>
              {error.confirmpassword && <span className="error-message">{error.confirmpassword}</span>}
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Inscription en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  S'inscrire
                </>
              )}
            </button>

            <div className="register-footer">
              <span>Déjà un compte ?</span>
              <a href="/auth/login" className="login-link">
                Se connecter
              </a>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #024443 0%, #026d6c 50%, #B58932 100%);
        }
        
        .register-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #024443 0%, #026d6c 50%, #B58932 100%);
          z-index: 0;
        }
        
        .register-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/images/bg-pattern.png') repeat;
          opacity: 0.05;
        }
        
        .register-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
          padding: 20px;
        }
        
        .register-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 40px 35px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .register-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
        }
        
        .register-header {
          text-align: center;
          margin-bottom: 35px;
        }
        
        .logo-section {
          margin-bottom: 20px;
        }
        
        .register-logo {
          height: 70px;
          width: auto;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }
        
        .register-title {
          font-size: 28px;
          font-weight: 700;
          color: #024443;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          font-family: 'Poppins', sans-serif;
        }
        
        .register-subtitle {
          font-size: 14px;
          color: #6c757d;
          margin: 0;
        }
        
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #B58932;
          font-size: 16px;
          z-index: 2;
          pointer-events: none;
        }
        
        .form-input {
          width: 100%;
          padding: 14px 45px 14px 45px;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #fff;
          font-family: inherit;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #B58932;
          box-shadow: 0 0 0 4px rgba(181, 137, 50, 0.1);
        }
        
        .form-input.error {
          border-color: #dc3545;
        }
        
        .floating-label {
          position: absolute;
          left: 45px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          padding: 0 5px;
          color: #94a3b8;
          font-size: 14px;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        
        .floating-label.active {
          transform: translateY(-30px);
          font-size: 11px;
          color: #B58932;
        }
        
        .error-message {
          display: block;
          color: #dc3545;
          font-size: 11px;
          margin-top: 5px;
          margin-left: 5px;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          font-size: 16px;
          transition: color 0.3s;
          z-index: 2;
        }
        
        .password-toggle:hover {
          color: #B58932;
        }
        
        .register-button {
          background: linear-gradient(135deg, #B58932 0%, #d4a143 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        
        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(181, 137, 50, 0.3);
          background: linear-gradient(135deg, #d4a143 0%, #B58932 100%);
        }
        
        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .register-footer {
          text-align: center;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          font-size: 14px;
          color: #6c757d;
        }
        
        .login-link {
          color: #B58932;
          text-decoration: none;
          font-weight: 600;
          margin-left: 8px;
          transition: color 0.3s;
        }
        
        .login-link:hover {
          color: #024443;
          text-decoration: underline;
        }
        
        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .register-card {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .register-card {
            padding: 30px 25px;
          }
          
          .register-title {
            font-size: 24px;
          }
          
          .form-input {
            padding: 12px 40px 12px 40px;
          }
        }
        
        @media (max-width: 480px) {
          .register-card {
            padding: 25px 20px;
          }
          
          .register-title {
            font-size: 22px;
          }
          
          .register-logo {
            height: 55px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;

