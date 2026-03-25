import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, Loader, Eye, EyeOff, CheckCircle } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation requirements
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  const validatePassword = (pwd) => {
    setPasswordChecks({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    });
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    validatePassword(pwd);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number) {
      setError("Password must be at least 8 characters with 1 uppercase letter and 1 digit");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const allChecksPass = passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            SafeNet
          </h1>
          <p className="text-slate-400">Join thousands protecting their inbox</p>
        </div>

        {/* Signup Card */}
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300 transition"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="p-3 bg-slate-700/50 rounded-lg space-y-2">
                <p className="text-xs text-slate-300 font-medium">Password Requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? "text-green-400" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded border ${passwordChecks.length ? "bg-green-500 border-green-500" : "border-slate-500"}`}></div>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordChecks.uppercase ? "text-green-400" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded border ${passwordChecks.uppercase ? "bg-green-500 border-green-500" : "border-slate-500"}`}></div>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordChecks.number ? "text-green-400" : "text-slate-400"}`}>
                    <div className={`w-4 h-4 rounded border ${passwordChecks.number ? "bg-green-500 border-green-500" : "border-slate-500"}`}></div>
                    One digit
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            {allChecksPass && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-10"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300 transition"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading || !allChecksPass}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="text-slate-400 text-sm">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block text-center py-2 px-4 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-blue-400 font-medium rounded-lg transition"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
