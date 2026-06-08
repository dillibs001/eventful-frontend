export default function CreateButton({ userRole }: { userRole: string }) {
  if (userRole !== 'CREATOR') return null; // Hide button for normal users

  return (
    <button className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
      Create New Event
    </button>
  );
}