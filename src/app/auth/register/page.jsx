import RegisterForm from "./Form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image (Unsplash) */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')",
        }}
        aria-hidden
      />

      {/* subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-saturate-90" aria-hidden />

      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/6 blur-3xl" aria-hidden></div>
      <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/5 blur-2xl" aria-hidden></div>

      <RegisterForm />
    </div>
  );
}
