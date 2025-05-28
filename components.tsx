import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiblicalPathContent, InteractionOutcome, GeoPoint } from './types';
import { BIBLICAL_PATH_DATA, ICON_BOOK_OPEN, ICON_QR_CODE, ICON_X_CIRCLE, ICON_MAP_PIN } from './constants.tsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, children, leftIcon, rightIcon, ...props }) => {
  const baseStyle = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background inline-flex items-center justify-center transition-colors duration-150";
  
  const variantStyles = {
    primary: "bg-brand-primary hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-brand-secondary hover:bg-amber-500 text-gray-900 focus:ring-amber-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-brand-surface text-brand-text-secondary focus:ring-gray-500 border border-brand-text-secondary"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-brand-surface shadow-lg rounded-lg p-4 sm:p-6 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300 ease-in-out">
      <div className={`bg-brand-surface rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brand-text">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            {ICON_X_CIRCLE}
          </Button>
        </div>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-gray-500 ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
      <textarea
        id={id}
        rows={3}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-brand-text placeholder-gray-500 ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-brand-text ${error ? 'border-red-500' : ''} ${className || ''}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const outcomeOptions = Object.values(InteractionOutcome).map(outcome => ({
  value: outcome,
  label: outcome.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}));


export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
  </div>
);

interface HeaderProps {
  onOpenBiblicalPath: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBiblicalPath }) => {
  const navLinkClass = ({ isActive }: {isActive: boolean}) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text'}`;

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-brand-secondary">
              Soul Winner
            </NavLink>
          </div>
          <nav className="hidden md:flex space-x-4">
            <NavLink to="/" className={navLinkClass}>Current Marathon</NavLink>
            <NavLink to="/upcoming" className={navLinkClass}>Upcoming</NavLink>
            <NavLink to="/stats" className={navLinkClass}>Statistics</NavLink>
          </nav>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onOpenBiblicalPath} leftIcon={ICON_BOOK_OPEN}>
              Path to Heaven
            </Button>
          </div>
        </div>
         {/* Mobile Nav - can be expanded with a burger menu if needed */}
        <nav className="md:hidden flex flex-wrap justify-center space-x-2 py-2 border-t border-gray-700">
            <NavLink to="/" className={navLinkClass}>Current</NavLink>
            <NavLink to="/upcoming" className={navLinkClass}>Upcoming</NavLink>
            <NavLink to="/stats" className={navLinkClass}>Stats</NavLink>
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-center py-4 mt-auto border-t border-gray-700">
      <p className="text-sm text-brand-text-secondary">&copy; {new Date().getFullYear()} Soul Winning Tracker. All rights reserved.</p>
    </footer>
  );
};


interface BiblicalPathModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const BiblicalPathModal: React.FC<BiblicalPathModalProps> = ({ isOpen, onClose }) => {
  const data: BiblicalPathContent = BIBLICAL_PATH_DATA;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${data.title} (${data.language})`} size="lg">
      <div className="space-y-4">
        {data.content.map((paragraph, index) => (
          <p key={index} className="text-brand-text-secondary leading-relaxed">{paragraph}</p>
        ))}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium text-brand-text mb-2">Share via QR Code</h3>
           {data.qrCodeUrl.startsWith('https://api.qrserver.com') ? (
            <img src={data.qrCodeUrl} alt="QR Code for Biblical Path" className="mx-auto w-40 h-40 border border-gray-600 p-1 rounded-md" />
           ) : (
            <div className="mx-auto w-40 h-40 border border-gray-600 p-1 rounded-md flex items-center justify-center bg-white text-gray-900">
              {ICON_QR_CODE} <span className="ml-2">QR Placeholder</span>
            </div>
           )}
        </div>
      </div>
    </Modal>
  );
};

interface GeoPointDisplayProps {
  point?: GeoPoint;
  label: string;
}

export const GeoPointDisplay: React.FC<GeoPointDisplayProps> = ({ point, label }) => {
  if (!point) return null;
  return (
    <div className="text-sm text-brand-text-secondary flex items-center">
      {ICON_MAP_PIN}
      <span className="ml-2 font-semibold">{label}:</span>
      <span className="ml-1">{point.address || `Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)}`}</span>
    </div>
  );
};