import dns from "dns";

export const validateEmailWithDNS = async (email) => {
  if (!email || typeof email !== "string") return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push("Şifre en az 8 karakter olmalıdır");
  }
  if (password.length > 16) {
    errors.push("Şifre en fazla 16 karakter olmalıdır");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Şifre en az bir büyük harf içermelidir");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Şifre en az bir küçük harf içermelidir");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Şifre en az bir sayı içermelidir");
  }
  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors,
    };
  }
  return {
    isValid: true,
    errors: [],
  };
};
