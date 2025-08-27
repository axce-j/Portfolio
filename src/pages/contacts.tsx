// src/pages/Contacts.tsx

const ContactsPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary text-white p-8">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4">Contacts</h1>
        <p className="text-sm text-gray-300 mb-6">
          This is a Tailwind test — if you see spacing, colors and rounded corners, Tailwind works.
        </p>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">
            Primary action
          </button>

          <a
            className="px-4 py-2 rounded-md border border-white/20 text-white/90 hover:bg-white/5 transition"
            href="#"
          >
            Secondary
          </a>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <strong>Primary hex:</strong> <span className="ml-2">#15161A</span>
        </div>
      </div>
    </main>
  );
};

export default ContactsPage;
