import RegisterForm from "@/components/auth/RegisterForm";


export const metadata = {
  title: "Sign Up | Artisano",
  description: "Create a new Artisano account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Artisano
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our community of artists and art lovers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* এখানে আমাদের বানানো ক্লায়েন্ট ফর্মটি কল করা হলো */}
        <RegisterForm />
      </div>
    </div>
  );
}