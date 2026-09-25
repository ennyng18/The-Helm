import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, AlertCircle, Shield, Building2, User } from "lucide-react";
import wiiLogo from "@/assets/wii-logo.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      name: "Owner",
      icon: Shield,
      description: "Full access to connections, mappings and write-back",
    },
    {
      name: "Integration Admin",
      icon: Building2,
      description: "Build and run syncs, approve records posted to QuickBooks",
    },
    {
      name: "Finance User",
      icon: User,
      description: "Run syncs and submit records for approval",
    },
  ];

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
    setUsername(roleName);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(username, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <img src={wiiLogo} alt="The WII Group" className="h-20 w-auto" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">The Helm</h1>
            <p className="text-sm text-muted-foreground mt-1">Monday.com &amp; QuickBooks Integration</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground text-center">Select your role to sign in</p>
          <div className="grid gap-3">
            {roles.map((role) => {
              const isSelected = selectedRole === role.name;
              return (
                <button
                  key={role.name}
                  onClick={() => handleRoleSelect(role.name)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-accent shadow-sm"
                      : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-foreground"}`}>
                      {role.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        {selectedRole && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Sign In as {selectedRole}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Demo credentials — Password: <span className="font-mono text-foreground">helm2024</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
